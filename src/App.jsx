
/* The following line can be included in your src/index.js or App.js file */

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import DisplayList from './components/renderList';
function App() {
  return (
    <div className="App">
      <h1>Grocery Helper</h1>
      <DisplayList/>
    </div>
  );
}

export default App;
