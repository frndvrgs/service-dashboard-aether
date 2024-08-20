import type { StatusModel } from "../../common/interface/common.model";
import type { AccountEntity } from "./domain/account.entity";
import type { SubscriptionEntity } from "./domain/subscription.entity";
import type {
  CreateAccountInput,
  UpdateAccountInput,
  CreateSessionInput,
} from "./interface/v1/account.dto";
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "./interface/v1/subscription.dto";

import type { CommonTypes } from "@types";

namespace AccountTypes {
  namespace Payload {
    namespace Service {
      interface BaseOutput {
        status: StatusModel;
      }

      namespace ListAccounts {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<AccountEntity>;
        }

        interface Output extends BaseOutput {
          output: AccountEntity[];
        }
      }

      namespace ReadAccount {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<AccountEntity>;
        }

        interface Output extends BaseOutput {
          output: AccountEntity;
        }
      }

      namespace CreateAccount {
        interface Input {
          input: CreateAccountInput;
        }

        interface Output extends BaseOutput {
          output: AccountEntity;
        }
      }

      namespace UpdateAccount {
        interface Input {
          account: string;
          input: UpdateAccountInput;
        }

        interface Output extends BaseOutput {
          output: AccountEntity;
        }
      }

      namespace RemoveAccount {
        interface Input {
          account: string;
        }

        type Output = BaseOutput;
      }

      namespace CreateSession {
        interface Input {
          input: CreateSessionInput;
        }

        interface Output extends BaseOutput {
          output: AccountEntity;
        }
      }

      namespace ListSubscriptions {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<SubscriptionEntity>;
        }

        interface Output extends BaseOutput {
          output: SubscriptionEntity[];
        }
      }

      namespace ReadSubscription {
        interface Input {
          options: CommonTypes.Payload.QueryOptions<SubscriptionEntity>;
        }

        interface Output extends BaseOutput {
          output: SubscriptionEntity;
        }
      }

      namespace CreateSubscription {
        interface Input {
          account: string;
          input: CreateSubscriptionInput;
        }

        interface Output extends BaseOutput {
          output: SubscriptionEntity;
        }
      }

      namespace UpdateSubscription {
        interface Input {
          subscription: string;
          input: UpdateSubscription;
        }

        interface Output extends BaseOutput {
          output: SubscriptionEntity;
        }
      }

      namespace RemoveSubscription {
        interface Input {
          subscription: string;
        }

        type Output = BaseOutput;
      }
    }
  }
}
