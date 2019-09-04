import React from 'react';
const Login = () => (
    <div>
        <form>
            {/*Initial Fields*/}
            <label>
                {"Username"}
                <input type="text" placeholder="Enter Username" required/>
            </label>
            {/*TODO: Replace <br> with css flex box*/}
            <br/>
            <label>
                {"Password"}
                <input type="password" placeholder="Enter Password" required/>
            </label>
            <br/>
            <button type="submit">Login</button>
            <br/>
            <label>
                <input type="checkbox" name="remember"/>{"Remember Me"}
            </label>
        </form>
    </div>
);
export default Login;