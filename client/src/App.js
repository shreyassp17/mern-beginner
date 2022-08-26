import { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setMail] = useState("");
  const [listOfFriends, setListOfFriends] = useState([]);

  const addFriend = () => {
    Axios.post('http://localhost:3001/addfriend', { name: name, age: age, email: email })
      .then((response) => { setListOfFriends([...listOfFriends, { _id: response.data._id, name: name, age: age, email: email }]) });
  }

  const deleteFriend = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setListOfFriends(listOfFriends.filter(val => {
        return val._id !== id;
      }))
    });
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/read').then((response) => { setListOfFriends(response.data) }).catch(() => { console.log('ERR') });
  }, [listOfFriends]);

  const updateFriend = (id) => {
    const newAge = prompt("Enter new age");
    Axios.put('http://localhost:3001/update', { newAge: newAge, id: id }).then(() => {
      setListOfFriends(listOfFriends.map(val => {
        return val.id === id ? { _id: id, name: val.name, age: newAge, email: val.email } : val;
      }))
    })
  };

  return (
    <div className="App">
      <h1>CRUD Application</h1>
      <div className="friendContainer">
        <div className="inputs">
          <input type="text" placeholder='Enter name' onChange={e => setName(e.target.value)} />
          <input type="number" placeholder='Enter age' onChange={e => setAge(e.target.value)} />
          <input type="text" placeholder='Enter email' onChange={e => setMail(e.target.value)} />
          <button onClick={addFriend}><strong>Add friend</strong></button>
        </div>
      </div>
      <hr style={{width:'50%'}}/>
      <h1>List of friends</h1>
      <div className='friends'>
        {listOfFriends.map(value => {
          return (
            <div className='friendContainer'>
              <div className='friend'>
                <h3>Name: {value.name}</h3>
                <h3>Age: {value.age}</h3>
                <h3>Email: {value.email}</h3>
              <button id='update' onClick={() => { updateFriend(value._id) }}>Update</button>
              <button id='delete' onClick={() => { deleteFriend(value._id) }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
