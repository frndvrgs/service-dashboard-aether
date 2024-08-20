import type { StatusModel } from "../../common/interface/common.model";
import type { WorkEntity } from "./domain/work.entity";
import type {
  CreateWorkInput,
  CreateSessionInput,
} from "./interface/v1/work.dto";

import type { CommonTypes } from "@types";

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
          work: string;
          input: UpdateWorkInput;
        }

        interface Output extends BaseOutput {
          output: WorkEntity;
        }
      }

      namespace RemoveWork {
        interface Input {
          work: string;
        }

        type Output = BaseOutput;
      }
    }
  }
}
