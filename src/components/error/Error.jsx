import { Link } from "react-router-dom";
const Error = () => {
  return (
    <div>
      <h1>Something's wrong with your request </h1>
      <Link to="/">Return Home</Link>
    </div>
  );
};
export default Error;
