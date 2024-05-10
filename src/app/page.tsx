"use client";
import { NextPage } from "next";
import { useState } from "react";

interface TableRow {
  data: string;
  isChecked: boolean;
  error: string;
}

const Home: NextPage = () => {
  const [tableData, setTableData] = useState<TableRow[]>([
    { data: "", isChecked: false, error: "" },
  ]);
  const [totalResult, setTotalResult] = useState<number>(0);

  const addRow = () =>
    setTableData([...tableData, { data: "", isChecked: false, error: "" }]);

  const removeRow = (index: number) =>
    tableData.length > 1 &&
    setTableData([...tableData.slice(0, index), ...tableData.slice(index + 1)]);

  const toggleCheckbox = (index: number) => {
    const newData = [...tableData];
    newData[index] = {
      ...newData[index],
      isChecked: !newData[index].isChecked,
    };
    setTableData(newData);
  };

  const handleInputChange = (index: number, value: string) => {
    const newData = [...tableData];
    newData[index] = {
      ...newData[index],
      data: value,
      error: validateInput(value),
    };
    setTableData(newData);
  };

  const validateInput = (value: string): string => {
    const regex = /^\d{2}-\d{2}$/;

    if (!regex.test(value)) return "Invalid format.";

    const [firstNum, secondNum] = value.split("-").map(Number);

    if (isNaN(firstNum) || isNaN(secondNum) || secondNum <= firstNum) {
      return "Invalid range.";
    }

    return "";
  };

  const calculateResult = (
    firstNum: number,
    secondNum: number,
    isChecked: boolean
  ): number => {
    const difference = secondNum - firstNum;
    let adjustedFirstNum = firstNum;

    if (difference < 3) adjustedFirstNum += 0;
    else if (difference >= 3 && difference < 6) adjustedFirstNum += 0.25;
    else if (difference >= 6 && difference < 7) adjustedFirstNum += 0.5;
    else if (difference >= 7 && difference < 9) adjustedFirstNum += 0.75;
    else if (difference >= 9) adjustedFirstNum += 1;

    let adjustedSecondNum = secondNum;

    if (secondNum > 23) adjustedSecondNum -= 0.5;

    if (secondNum > 22) {
      const firstDifference = 22 - adjustedFirstNum;
      const secondDifference = adjustedSecondNum - 22;

      let firstResult = firstDifference * (isChecked ? 1300 : 1200);
      let secondResult = secondDifference * (isChecked ? 1625 : 1525);

      return firstResult + secondResult;
    } else {
      let result =
        (adjustedSecondNum - adjustedFirstNum) * (isChecked ? 1300 : 1200);
      return result;
    }
  };

  const handleSubmit = () => {
    let totalResult = tableData.reduce((acc, rowData) => {
      const [firstNum, secondNum] = rowData.data.split("-").map(Number);
      if (!isNaN(firstNum) && !isNaN(secondNum)) {
        return acc + calculateResult(firstNum, secondNum, rowData.isChecked);
      }
      return acc;
    }, 0);

    setTotalResult(totalResult);
  };

  return (
    <div className="bg-white min-h-screen text-black flex items-center text-center">
      <div className="mx-auto p-4">
        <table className="bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4"></th>
              <th className="w-52 py-2">Shift Time</th>
              <th className="w-12"></th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ isChecked, data, error }, index) => (
              <tr key={index}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheckbox(index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={data}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-30"
                  />
                </td>
                <td className="text-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                </td>
                <td className="text-red-500 pr-4">{error}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-start">
          <button
            onClick={addRow}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            +
          </button>
          <button
            onClick={handleSubmit}
            className="mt-2 p-2 ml-2 bg-green-500 text-white rounded"
          >
            Calculate
          </button>
        </div>
        <div className="mt-2 text-start">{`Total Result: ${totalResult}`}</div>
      </div>
    </div>
  );
};

export default Home;
