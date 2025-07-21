
import { Forum } from "@/components/Forum";
import { TextField } from "@/components/TextField";
import { SubmitBtn } from "@/components/SubmitBtn";

export default function LoginPage() {
  return(<>
    <h1>LOGIN</h1>
    <div>
      <Forum request='POST /api/userProfile/login'>
        <TextField bodyField='email'></TextField>
        <TextField bodyField='password'></TextField>
        <SubmitBtn text="Submit" styling="bg-blue-500 text-white px-4 py-2 rounded" />
      </Forum>
    </div>
  </>);
}

