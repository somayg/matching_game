import React from 'react';
import { Link} from 'react-router-dom';


function Level(){
    return(
    <div>
        <Link to="/" className="btn">Back</Link> 
    <header>
        <h1>Select a Level!</h1>
        <h2>difficulty increases with each level</h2>
    </header>
    <nav>
        <ul>
            {/* <li>
                <Link to="/Game" className="btn">Insect Matching</Link>
            </li> */}
            <li>
                <Link to="/Game" className="btn">Level 1</Link>
                 <Link to="/Game" className="btn">Level 2</Link>
            </li>
        </ul>
    </nav>
        
    
       
    </div>
    );
}
export default Level;