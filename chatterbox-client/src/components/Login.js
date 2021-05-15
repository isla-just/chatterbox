const Login=()=>{
    return(
        <div>
            <div className="half">
            <div class="logo-container"></div>

            <h3>- LOGIN -</h3>

            <div className="row">
                <input type='text' name='email' placeholder="Email"/>
            </div>


            <div className="row">
                <input type='text' name='password' placeholder="Password"/>
            </div>

            <div className="row">
                <p>Oops! I've forgotten my password</p>
            </div>
             
            <div className="row">
                <input id="button" type='submit' value='submit'/>
            </div>

            </div>
            <div className="image"></div>
        </div>
    );
}
export default Login