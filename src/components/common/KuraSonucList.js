import React, { useEffect, useState, useRef } from "react";
import { Table } from "reactstrap";
function KuraSonucList({
  visible,
  list,
  header,
  slowDraw,
  slowInterval,
  durum,
}) {
  const tableRef = useRef(null);
  const [kazananlar, setKazananlar] = useState([]);
  useEffect(() => {
    if (slowDraw) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < list.length ) {
          setKazananlar(list.slice(0, i));
          i++;
          if (tableRef.current){
            tableRef.current.scrollIntoView({ behavior: "smooth" });
          }
          
        } else {
          clearInterval(interval);
        }
      }, slowInterval);
    } else {
      setKazananlar(list);
    }
  }, [slowDraw, slowInterval, list]);

  return (
    <div>
      {visible && (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              {header.map((h, index) => (
                <th key={index}>{h}</th>
              ))}
              <th>Durum</th>
            </tr>
          </thead>
          <tbody
            
          >
            {kazananlar.map((kazanan, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                {header.map((h, index) => (
                  <td key={index}>{kazanan[h]}</td>
                ))}
                <td>{durum}</td>
              </tr>
            ))}
            <div ref={tableRef}></div>
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default KuraSonucList;
