import SortableTable from '../components/SortableTable'
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
      work: "Google", // or open to work
      role: "Engineer",
      projects: [{name: 'nft',a: 'https://google.com'}, {name: "meta",a:'https://google.com'}], //current projects
      refer: true, // or no
      updated: "October 24",
    },
    {
      id: 1,
      name: "The Doe",
      email: "thedoe@gmail.com",
      phone: "123-456-7891",
      location: "San Francisco",
      work: "🔎", // or open to work
      role: "",
      projects: [{name: 'web3',a:'https://google.com'}], //current projects
      refer: false, // or no
      updated: "October 24",
    },
    {
      id: 2,
      name: "Big Doe",
      email: "bigdoe@gmail.com",
      phone: "123-456-7892",
      location: "Miami",
      work: "CompanyName", // or open to work
      role: "Founder",
      projects: [], //current projects
      refer: true, // or no
      updated: "October 24",
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
