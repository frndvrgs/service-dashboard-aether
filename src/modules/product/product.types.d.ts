import type { StatusModel } from "../../common/interface/common.model";
import type { WorkEntity } from "./domain/work.entity";
import type {
  CreateWorkInput,
  UpdateWorkInput,
  CommandWorkInput,
} from "./interface/v1/work.dto";

namespace ProductTypes {
  namespace Payload {
    namespace Service {
      interface BaseOutput {
        status: StatusModel;
      }

      namespace ListWorks {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<WorkEntity>;
        }

        interface Output extends BaseOutput {
          output: WorkEntity[];
        }
      }

      namespace ReadWork {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<WorkEntity>;
        }

        interface Output extends BaseOutput {
          output: WorkEntity;
        }
      }

      namespace CreateWork {
        interface Input {
          account: string;
          feature: string;
          input: CreateWorkInput;
        }

        interface Output extends BaseOutput {
          output: WorkEntity;
        }
      }

      namespace UpdateWork {
        interface Input {
          account: string;
          work: string;
          input: UpdateWorkInput;
        }

        interface Output extends BaseOutput {
          output: WorkEntity;
        }
      }

      namespace RemoveWork {
        interface Input {
          account: string;
          work: string;
        }

        type Output = BaseOutput;
      }

      namespace CommandWork {
        interface Input {
          account: string;
          work: string;
          command: string;
        }

        type Output = BaseOutput;
      }

      namespace Audit {
        interface DumpSourceCodeRequest {
          id_work: string;
          id_repository: string;
          github_token: string;
        }

        interface DumpSourceCodeResponse {
          id_work: string;
          id_repository: string;
          process_status: string;
          code_dump?: string;
          error_message?: string;
        }

        interface AnalyzeSourceCodeRequest {
          id_work: string;
          id_repository: string;
          code_dump: string;
        }

        interface AnalyzeSourceCodeResponse {
          id_work: string;
          id_repository: string;
          process_status: string;
          result?: string;
          error_message?: string;
        }

        interface AnalyzePullRequestRequest {
          id_work: string;
          id_repository: string;
          id_pull_request: string;
          code_dump: string;
        }

        interface AnalyzePullRequestResponse {
          id_work: string;
          id_repository: string;
          id_pull_request: string;
          process_status: string;
          result?: string;
          error_message?: string;
        }

        interface WatchPullRequestsRequest {
          id_work: string;
          id_repository: string;
          code_dump: string;
          github_token: string;
        }

        interface WatchPullRequestsResponse {
          id_work: string;
          id_repository: string;
          process_status: string;
          result?: string;
          error_message?: string;
        }

        interface InterruptProcessRequest {
          id_work: string;
        }

        interface InterruptProcessResponse {
          id_work: string;
          success: boolean;
          error_message?: string;
        }
      }
    }
  }
}
