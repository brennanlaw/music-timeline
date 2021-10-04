import React from "react";
import './style/yearSelector.css';

function AlbumsDisplay(props) {

    const selectedYear = props.selectedYear;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (var i = 2000; i <= currentYear; i++) {
        years.push(i);
    }

    return (
        <div className="year_selector">
            {
                years.map(year => {
                    return <button 
                        className="year_button"
                        key={year} 
                        onClick={() => props.changeYear(year.toString())}
                        style={(selectedYear===year.toString()) ? {"backgroundColor":"steelblue","color":"white","fontWeight":"bold"} : {}}>
                    {year}</button>
                    
                })
            }
        </div>
    ) 
}

export default AlbumsDisplay;