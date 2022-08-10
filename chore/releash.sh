#!/bin/bash -e

# https://gist.github.com/harryparkdotio/6164ad66f14c860703d40839b00bf684

current_version=$(node -p "require('./package').version")

# check branch is master
if [[ $(git rev-parse --abbrev-ref HEAD) != "master" ]]; then
  echo "current branch must be master to create a new release"
  exit 1
fi

# check working tree clean
if [[ -n $(git status -s) ]]; then
  echo "working tree must be clean to create a new release"
  exit 1
fi

echo "current version: $current_version"
printf "input the type of release: [patch, minor, major] (patch)："
read release_type

if [ -z "$release_type" ]; then
  release_type="patch"
fi

if [ "$release_type" != "major" ] && [ "$release_type" != "minor" ] && [ "$release_type" != "patch" ]; then
  echo "Please provide the type of release: [patch, minor, major]"
  exit 1
fi

echo "Bumping $release_type version.."
tag=$(npm version $release_type -m "chore(release): v%s")

if [ "$?" = "1" ]; then
  exit 1
fi

echo ""
echo "$TAG created"
