import type { StatusModel } from "../../common/interface/common.model";
import type { ProfileEntity } from "./domain/profile.entity";
import type { FeatureEntity } from "./domain/feature.entity";
import type {
  CreateProfileInput,
  CreateSessionInput,
  UpdateProfileInput,
} from "./interface/v1/profile.dto";
import type {
  CreateFeatureInput,
  UpdateFeatureInput,
} from "./interface/v1/feature.dto";

namespace ContentTypes {
  namespace Payload {
    namespace Service {
      interface BaseOutput {
        status: StatusModel;
      }

      namespace ListProfiles {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<ProfileEntity>;
        }

        interface Output extends BaseOutput {
          output: ProfileEntity[];
        }
      }

      namespace ReadProfile {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<ProfileEntity>;
        }

        interface Output extends BaseOutput {
          output: ProfileEntity;
        }
      }

      namespace CreateProfile {
        interface Input {
          account?: string;
          input?: CreateProfileInput;
        }

        interface Output extends BaseOutput {
          output: ProfileEntity;
        }
      }

      namespace UpdateProfile {
        interface Input {
          account?: string;
          input: UpdateProfileInput;
        }

        interface Output extends BaseOutput {
          output: ProfileEntity;
        }
      }

      namespace RemoveProfile {
        interface Input {
          account: string;
        }

        type Output = BaseOutput;
      }

      namespace ListFeatures {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<FeatureEntity>;
        }

        interface Output extends BaseOutput {
          output: FeatureEntity[];
        }
      }

      namespace ReadFeature {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<FeatureEntity>;
        }

        interface Output extends BaseOutput {
          output: FeatureEntity;
        }
      }

      namespace CreateFeature {
        interface Input {
          input: CreateFeatureInput;
        }

        interface Output extends BaseOutput {
          output: FeatureEntity;
        }
      }

      namespace UpdateFeature {
        interface Input {
          feature: string;
          input: UpdateFeatureInput;
        }

        interface Output extends BaseOutput {
          output: FeatureEntity;
        }
      }

      namespace RemoveFeature {
        interface Input {
          feature: string;
        }

        type Output = BaseOutput;
      }
    }
  }
}
