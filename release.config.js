const config = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/git",
      {
        assets: [
          "./out/make/deb/arm64/*.deb",
          "./out/make/deb/x64/*.deb",
          "./out/make/rpm/arm64/*.rpm",
          "./out/make/rpm/x64/*.rpm",
          "./out/make/squirrel.windows/arm64/*.exe*",
          "./out/make/squirrel.windows/x64/*.exe*",
          "./out/make/zip/darwin/arm64/*.zip",
          "./out/make/zip/darwin/x64/*.zip",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};

module.exports = config;
