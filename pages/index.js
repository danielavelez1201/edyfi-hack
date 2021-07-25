import SortableTable from '../componenets/SortableTable'
import { useState, useEffect } from "react";

export default function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        "https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setPeople(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold">Home</h1>
      </div>
      <SortableTable people={people} />
    </div>
  );
}
