import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [employees, setEmployees] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:5001/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h1>Employee Management System</h1>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;