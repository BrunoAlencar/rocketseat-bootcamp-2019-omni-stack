import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';
import { Loading, Owner, IssueList, IssueState, Pagination } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    repoName: '',
    issues: [],
    issueState: 'open',
    loading: true,
    page: 1,
    perPage: 30,
    quantityIssuesByState: {
      open: 0,
      closed: 0,
      all: 0,
    },
  };

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { perPage } = this.state;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: perPage,
          page: 1,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
      repoName,
      quantityIssuesByState: {
        open: repository.data.open_issues_count,
        all: issues.data[0].number,
        closed: issues.data[0].number - repository.data.open_issues_count,
      },
    });
  }

  // componentDidUpdate(_, prevState) {
  //   const { issues } = this.state;
  //   if (prevState.issues !== issues) {
  //     console.log(issues);
  //   }
  // }

  getIssues = async (e, page) => {
    const {
      page: pageFromState,
      repoName,
      perPage,
      issueState: state,
    } = this.state;
    const issueState = e ? e.target.value : state;
    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: issueState,
        per_page: perPage,
        page: page || pageFromState,
      },
    });
    this.setState({ issues: issues.data, issueState });
  };

  changePage = (page, e) => {
    this.setState({ page });
    this.getIssues('' || e, page);
  };

  changeIssueState = e => {
    this.changePage(1, e);
  };

  render() {
    const {
      loading,
      repository,
      issues,
      issueState,
      page,
      perPage,
      quantityIssuesByState,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    let isEqualToTotalNumber = false;
    if (
      (page * perPage === quantityIssuesByState.open &&
        issueState === 'open') ||
      (page * perPage === quantityIssuesByState.closed &&
        issueState === 'closed') ||
      (page * perPage === quantityIssuesByState.all && issueState === 'all')
    ) {
      isEqualToTotalNumber = true;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          <div className="issue-state">
            Issues:
            <IssueState value={issueState} onChange={this.changeIssueState}>
              <option value="open">Abertas</option>
              <option value="closed">Fechadas</option>
              <option value="all">Todas</option>
            </IssueState>
          </div>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
          <Pagination>
            <button
              disabled={page === 1}
              type="button"
              onClick={() => this.changePage(page - 1)}
            >
              <FaArrowLeft />
              Página anterior
            </button>
            <button
              disabled={issues.length < perPage || isEqualToTotalNumber}
              type="button"
              onClick={() => this.changePage(page + 1)}
            >
              Próxima página
              <FaArrowRight />
            </button>
          </Pagination>
        </IssueList>
      </Container>
    );
  }
}
