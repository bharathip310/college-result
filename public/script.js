async function getResult() {
  const roll = document.getElementById("rollInput").value;

  if (!roll) {
    alert("Enter roll number!");
    return;
  }

  const res = await fetch(`/result/${roll}`);
  const data = await res.json();

  const output = document.getElementById("output");

  if (data.error) {
    output.innerHTML = `<p style="color:red;">${data.error}</p>`;
    return;
  }

  output.innerHTML = `
    <h2>Result for Roll No: ${data.roll}</h2>
    <p>Name: ${data.name}</p>
    <h3>Marks:</h3>
    <ul>
      <li>Tamil: ${data.marks.tamil}</li>
      <li>English: ${data.marks.english}</li>
      <li>Maths: ${data.marks.maths}</li>
      <li>Science: ${data.marks.science}</li>
      <li>Social: ${data.marks.social}</li>
    </ul>
    <h3>Total Marks: ${data.total}</h3>
    <h3>Result: ${data.result}</h3>
  `;
}

