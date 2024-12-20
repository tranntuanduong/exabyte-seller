// ** React Imports
import { useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Hook Imports
import { useAuth } from "src/hooks/useAuth";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === "client") return "/acl";
  else return "/home";
};

const Home = () => {
  // ** Hooks
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user.id) {
      router.push("/login");
      return;
    }
  }, [user]);

  return (
    <div>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default Home;
