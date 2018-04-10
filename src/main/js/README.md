# repocheck

JavaScript and CLI client using GitHub's public API retrieve repository stats for a given organization

## Authorization

You are required to have an access GitHub access token when using repocheck.
See [github docs](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) on how to create your access token.

Reminder that your access token should not be shared or exposed.

## Installation

Requires **Node > v8.0+** and **Yarn package manager**.

This module is published in the public yarn registry at https://registry.yarnpkg.com.

For CLI usage:

```
$ yarn global add "@nsaechao/repocheck" --registry=https://registry.yarnpkg.com
```

For use as a node module, add the following module to your `package.json`:

```
$ yarn add `@nsaechao/repocheck` 
```

## Testing

Included in this module are some basic integrity checks including linting.

```
$ yarn install
$ yarn test
$ yarn lint
```

## CLI

```
  Usage: repocheck-app [options] [command]

  Use -h to get help

  Options:

    -V, --version        output the version number
    -h, --help           output usage information

  Commands:

    get [options] <org>  Print out relevant repo information for the provide organization.
```

## Access Token

Your access token can be passed in directly as a command-line parameter.
Another way is through the environment variable `AUTH_TOKEN`.

### Get

For a given organization, print to stdout repository stats based on configurable options.

```
  Usage: get [options] <org>

  Print out relevant repo information for the provide organization.

  Options:

    --sort-by <mode>      Sort in descending order by either [stars,forks,prs,contribs]. (default: stars)
    --top <number>        Show top-N repos (default: 5)
    --user-agent <agent>  User-Agent (default: repocheck)
    --auth-token <token>  Github authorization token
    -h, --help            output usage information
```

##### Example

```
$ repocheck-app get pantsbuild --auth-token=<your_token>
```

Alternatively passing in the token as an environmental variable.

```
$ AUTH_TOKEN=<your_token> repocheck-app get pantsbuild
```

Output:

```
NAME                  STARS FORKS PULLREQUESTS CONTRIBUTIONRANK
pex                   979   114   183          1.61            
pants                 938   268   3763         14.04           
intellij-pants-plugin 42    28    218          7.79            
jarjar                18    14    20           1.43            
pantsbuild.github.io  9     6     6            1.00 
```

Output when `--json` option is applied:

```json
[{"name":"pex","stars":979,"forks":114,"pullRequests":183,"contributionRank":"1.61"},{"name":"pants","stars":938,"forks":268,"pullRequests":3763,"contributionRank":"14.04"},{"name":"intellij-pants-plugin","stars":42,"forks":28,"pullRequests":218,"contributionRank":"7.79"},{"name":"jarjar","stars":18,"forks":14,"pullRequests":20,"contributionRank":"1.43"},{"name":"pantsbuild.github.io","stars":9,"forks":6,"pullRequests":6,"contributionRank":"1.00"}]
```


## Module usage

Add the repocheck module to your project:

```
$ yarn add @nsaechao/repocheck
```

Require repocheck:

```js
const repocheck = require('repocheck');
```

### Get

`const new repocheck('pantsbuild', 'stars', 5, '<your_token>').get().then((response) => {console.info(response)});`

Returns:

```
[ { name: 'pex',
    stars: 979,
    forks: 114,
    pullRequests: 183,
    contributionRank: '1.61' },
  { name: 'pants',
    stars: 938,
    forks: 268,
    pullRequests: 3763,
    contributionRank: '14.04' },
  { name: 'intellij-pants-plugin',
    stars: 42,
    forks: 28,
    pullRequests: 218,
    contributionRank: '7.79' },
  { name: 'jarjar',
    stars: 18,
    forks: 14,
    pullRequests: 20,
    contributionRank: '1.43' },
  { name: 'pantsbuild.github.io',
    stars: 9,
    forks: 6,
    pullRequests: 6,
    contributionRank: '1.00' } ]
```
