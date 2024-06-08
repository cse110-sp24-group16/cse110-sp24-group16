const config = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/git",
      {
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
    {
      assets: [
        {
          path: "out/make/deb/arm64/*.deb",
          name: "deb_arm64-${nextRelease.gitTag}.deb",
          label: "deb_arm64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/deb/x64/*.deb",
          name: "deb_x64-${nextRelease.gitTag}.deb",
          label: "deb_x64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/rpm/arm64/*.rpm",
          name: "rpm_arm64-${nextRelease.gitTag}.rpm",
          label: "rpm_arm64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/rpm/x64/*.rpm",
          name: "rpm_x64-${nextRelease.gitTag}.rpm",
          label: "rpm_x64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/squirrel.windows/x64/*.exe*",
          name: "win_x64-${nextRelease.gitTag}.exe",
          label: "win_x64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/zip/darwin/arm64/*.zip",
          name: "mac_arm64-${nextRelease.gitTag}.zip",
          label: "mac_arm64 (${nextRelease.gitTag}) distribution",
        },
        {
          path: "out/make/zip/darwin/x64/*.zip",
          name: "mac_x64-${nextRelease.gitTag}.zip",
          label: "mac_x64 (${nextRelease.gitTag}) distribution",
        },
      ],
    },
  ],
};

module.exports = config;
