import SortableTable from '../componenets/SortableTable'
import { useState, useEffect } from 'react'

export default function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [people, setPeople] = useState([
    {
      id: 0,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "123-456-7890",
      location: "New York",
      workingAt: "Google", // or open to work
      projects: ['1', "", "Github"], //current projects
      lastUpdated: "01 Jan 1970 00:00:00 GMT",
      referral: "Yes", // or no
    },
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetch(
  //       "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole"
  //     )
  //       .then((res) => res.json())
  //       .then(
  //         (result) => {
  //           setIsLoaded(true);
  //           setPeople(result);
  //         },
  //         (error) => {
  //           setIsLoaded(true);
  //           setError(error);
  //         }
  //       );
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="mt-12">
        <h1 className="text-3xl font-bold">Home</h1>
      </div>
      {people !== [] && <SortableTable people={people} />}
    </div>
  )
}
