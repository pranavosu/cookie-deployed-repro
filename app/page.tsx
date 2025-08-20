import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { runWithAmplifyServerContext } from "./amplify-server-utils";
import { cookies } from "next/headers";
import { TodoList } from "./TodoList";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import App from "./components/app";
// export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
//   config: outputs,
//   cookies,
// });

// Server component that fetches initial data
export default async function Page() {
  // const initialTodos = await runWithAmplifyServerContext({
  //   nextServerContext: { cookies },
  //   operation: (contextSpec) => {
  //     const client = generateServerClientUsingCookies<Schema>();
  //     return client.models.Todo.list();
  //   },
  // });

  return (
    <main>
      <App />
      {/* <div>
        🥳 App successfully hosted with SSR. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/build-a-backend/server-side-rendering/">
          Learn more about Amplify SSR.
        </a>
      </div> */}
    </main>
  );
}
  