const exec = require('child-process-promise').exec;
const assert = require('assert');

describe('repocheck-app', () => {
  describe('get', () => {
    it('should require an organization', (done) => {
      exec('bin/repocheck-app get')
        .catch((err) => {
          assert(err.code === 1);
          assert.equal(err.stderr, '\n  error: missing required argument `org\'\n\n');
        })
        .then(done, done);
    });

    it('should reject if token is missing', (done) => {
      exec('bin/repocheck-app get pantsbuild')
        .then((result) => {
          assert(false);
        })
        .catch((err) => {
           assert(err.code === 1);
        })
        .then(done, done);
    });

    it('should fail on invalid sort-by option', (done) => {
      exec('bin/repocheck-app get pantsbuild --sort-by=pr --token=some_token')
        .then((result) => {
          assert(false);
        })
        .catch((err) => {
           assert(err.code === 1);
        })
        .then(done, done);
    });
    it('should fail on non-integer top', (done) => {
       exec('bin/repocheck-app get pantsbuild --top=x --token=some_token')
         .then((result) => {
           assert(false);
         })
         .catch((err) => {
           assert(err.code === 1);
         })
         .then(done, done);
     });

  });
});