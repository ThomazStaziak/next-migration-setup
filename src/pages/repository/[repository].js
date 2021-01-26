import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router'
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from '../../styles/pages/repository';

export default function Repository({ match }) {
    
  const [repositoryData, setRepositoryData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
    
  const router = useRouter()
  const { repository } = router.query
  useEffect(() => {
    async function fetch() {
      try {
        const repoName = decodeURIComponent(repository);
  
        const [repoDetails, issuesData] = await Promise.all([
          api.get(`/repos/${repoName}`),
          api.get(`/repos/${repoName}/issues`, {
            params: {
              state: 'open',
              per_page: 5,
            },
          }),
        ]);
  
        setRepositoryData(repoDetails.data);
        setIssues(issuesData.data);
        setLoading(false);
      } catch (error) {
        alert('Volte uma página e tente novamente')
      }
    }

    fetch();
  }, [repository]);

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container>
      <Owner>
        <Link href="/">Back to the repositories</Link>
        <img src={repositoryData.owner.avatar_url} alt={repositoryData.owner.login} />
        <h1>{repositoryData.name}</h1>
        <p>{repositoryData.description}</p>
      </Owner>

      <IssueList>
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
      </IssueList>
    </Container>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
