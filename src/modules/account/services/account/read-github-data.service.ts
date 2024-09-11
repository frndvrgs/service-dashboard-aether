import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class ReadGitHubDataService {
  constructor() {}

  async execute(
    service: AccountTypes.Payload.Service.ReadGitHubData.Input,
  ): Promise<AccountTypes.Payload.Service.ReadGitHubData.Output> {
    try {
      const { github_token } = service;

      const { Octokit } = await import("@octokit/rest");
      const octokit = new Octokit({ auth: github_token });

      const { data: reposData } = await octokit.repos.listForAuthenticatedUser({
        visibility: "all",
        affiliation: "owner,collaborator,organization_member",
        per_page: 100,
      });

      const repositories = await Promise.all(
        reposData.map(async (repo) => {
          const { data: pullRequests } = await octokit.pulls.list({
            owner: repo.owner.login,
            repo: repo.name,
            state: "open",
            per_page: 100,
          });

          const formattedPullRequests = pullRequests.map((pr) => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            url: pr.html_url,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            user: {
              id: pr.user?.id,
              login: pr.user?.login,
              avatar_url: pr.user?.avatar_url,
            },
          }));

          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            private: repo.private,
            url: repo.html_url,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pull_requests: formattedPullRequests.length
              ? formattedPullRequests
              : null,
          };
        }),
      );

      return {
        output: repositories,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new AppException(
          "GITHUB_API_ERROR",
          500,
          "GitHub API error",
          error.message,
        );
      }
      throw new AppException(
        "GITHUB_API_ERROR",
        500,
        "GitHub API error",
        "octokit unknown error",
      );
    }
  }
}
