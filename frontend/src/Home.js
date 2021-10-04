import React, { useState } from "react";
import AlbumsDisplay from "./AlbumsDisplay.js";
import YearSelector from "./YearSelector.js";

function Home() {

    const [year, setYear] = useState("2018");

    var changeYear = (newYear) => {
        setYear(newYear);
    };

    return (
        <div>
            <YearSelector selectedYear={year} changeYear={changeYear} />
            <h1>{year}</h1>
            <AlbumsDisplay year={year}/>
        </div>
    );
}

export default Home;