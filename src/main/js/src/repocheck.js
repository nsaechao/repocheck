'use strict';

const request = require('request-promise');

const VALID_SORTBY_MODES = ['stars', 'forks', 'prs', 'contribs'];
const GITHUB_API_GRAPH_URL = 'https://api.github.com/graphql';

// TODO: Add type-checking with flow
class RepoCheck {
  constructor(org, sortBy, top, authToken, userAgent) {
    if (!VALID_SORTBY_MODES.includes(sortBy)) {
      throw new Error(`\n error: sortBy option \`${sortBy}' is not valid.\n`);
    }

    this.org = org;
    this.sortBy = sortBy;
    this.top = top;
    this.authToken = authToken;
    this.userAgent = userAgent;

    // TODO: As of writing, github v4 graphql supports a max of 100 repos.
    // If the organization has more than 100 repos, need to add a spool.
    // Otherwise the filtered results may be incorrect.
    // Spool can be implemented through pagination. See http://graphql.org/learn/pagination/
    this.body = {
      query: `query {
        organization(login: "${this.org}") {
          repositories(first: 100) {
            edges {
              node {
                name
                forkCount
                stargazers {
                  totalCount
                }
                pullRequests {
                  totalCount
                }
              }
              cursor
            }
          }
        }
      }`
    };

    this.options = {
      url: GITHUB_API_GRAPH_URL,
      method: 'POST',
      json: true,
      headers: {
        'User-Agent': this.userAgent || 'repocheck',
        'Authorization': `bearer ${this.authToken}`
      },
      transform2xxOnly: true,
      transform: (body) => {
        try {
          const repos = this.parseResults(body);
          return this.filterResults(repos, this.sortBy, this.top);
        }
        catch (err) {
          throw new Error('data transform failed!');
        }
      },
      body: this.body
    };
  }

  parseResults(result) {
    const edges = result
      .data
      .organization
      .repositories
      .edges;
    return edges.map((e) => {
      const name = e.node.name;
      const stars = e.node.stargazers.totalCount;
      const forks = e.node.forkCount;
      const pullRequests = e.node.pullRequests.totalCount;
      const contribRank = (pullRequests === 0 || forks === 0) ? 0 : pullRequests / forks;
      return {
        name: name,
        stars: stars,
        forks: forks,
        pullRequests: pullRequests,
        contributionRank: contribRank.toFixed(2)
      };
    });
  }

  filterResults(repos, sortBy, top) {
    const compare = (r1, r2) => {
      if (sortBy === 'stars') {
        return r2.stars - r1.stars;
      }
      else if (sortBy === 'forks') {
        return r2.forks - r1.forks;
      }
      else if (sortBy === 'prs') {
        return r2.pullRequests - r1.pullRequests;
      }
      else if (sortBy === 'contribs') {
        return r2.contributionRank - r1.contributionRank;
      }
      else {
        return r2.stars - r1.stars;
      }
    };
    return repos.sort(compare).slice(0, top);
  }

  get() {
    // Suggestion: This query can most likely be extracted as a separate graphql file and templated.
    return request(this.options);
  }
}

module.exports = RepoCheck;
