const assert = require('assert');
const RepoCheck = require('../src/repocheck');
const nockBack = require('nock').back;

// To record a new fixture, uncomment lines below.
// nockBack.setMode('record');
nockBack.fixtures = __dirname + '/nockFixtures'; //this only needs to be set once in your test helper

describe('repocheck', function() {
  describe('get', () => {
    it('should correctly build a request', () => {
      const repocheck = new RepoCheck("pantsbuild", "prs", "2", "some_token");
      const body = {
        query: 'query {\n        organization(login: "pantsbuild") {\n          repositories(first: 100) {\n            edges {\n              node {\n                name\n                forkCount\n                stargazers {\n                  totalCount\n                }\n                pullRequests {\n                  totalCount\n                }\n              }\n              cursor\n            }\n          }\n        }\n      }'
      };
      const headers = {
        'User-Agent': 'repocheck',
        'Authorization': `bearer some_token`
      };
      assert.deepEqual(body, repocheck.body);
      assert.deepEqual(headers, repocheck.options.headers);
    });

    it('should correctly transform response body', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck("pantsbuild", "stars", "1", "some_token");
          const request = repocheck.request();
          const expectedBody = [
            { name: 'pex',
              stars: 979,
              forks: 114,
              pullRequests: 183,
              contributionRank: '1.61'
            }
          ];
          return request
            .then((body) => {
              assert.deepEqual(body, expectedBody);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });

    it('should correctly limit top', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck('pantsbuild', 'stars', '3', 'some_token');
          const request = repocheck.request();
          return request
            .then((body) => {
              assert(body.length === 3);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });

    it('should correctly sort by stars', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck("pantsbuild", "stars", "2", "some_token");
          const request = repocheck.request();
          const expectedBody = [
            { name: 'pex',
              stars: 979,
              forks: 114,
              pullRequests: 183,
              contributionRank: '1.61'
            },
            { name: 'pants',
              stars: 938,
              forks: 268,
              pullRequests: 3756,
              contributionRank: '14.01'
            }
          ];
          return request
            .then((body) => {
              assert.deepEqual(body, expectedBody);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });

    it('should correctly sort by prs', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck("pantsbuild", "prs", "2", "some_token");
          const request = repocheck.request();
          const expectedBody = [
            { name: 'pants',
              stars: 938,
              forks: 268,
              pullRequests: 3756,
              contributionRank: '14.01'
            },
            { name: 'intellij-pants-plugin',
              stars: 42,
              forks: 28,
              pullRequests: 217,
              contributionRank: '7.75' }
          ];
          return request
            .then((body) => {
              assert.deepEqual(body, expectedBody);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });

    it('should correctly sort by forks', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck("pantsbuild", "forks", "2", "some_token");
          const request = repocheck.request();
          const expectedBody = [
            { name: 'pants',
              stars: 938,
              forks: 268,
              pullRequests: 3756,
              contributionRank: '14.01'
            },
            { name: 'pex',
              stars: 979,
              forks: 114,
              pullRequests: 183,
              contributionRank: '1.61'
            }
          ];
          return request
            .then((body) => {
              assert.deepEqual(body, expectedBody);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });

    it('should correctly sort by contribs', () => {
      return nockBack('pantsbuildFixture.json')
        .then(({nockDone, context}) => {
          const repocheck = new RepoCheck("pantsbuild", "prs", "2", "some_token");
          const request = repocheck.request();
          const expectedBody = [
            { name: 'pants',
              stars: 938,
              forks: 268,
              pullRequests: 3756,
              contributionRank: '14.01'
            },
            { name: 'intellij-pants-plugin',
              stars: 42,
              forks: 28,
              pullRequests: 217,
              contributionRank: '7.75'
            }
          ];
          return request
            .then((body) => {
              assert.deepEqual(body, expectedBody);
            })
            .catch((err) => {
              assert(false);
            })
            .then(nockDone);
        });
    });
  });
});
