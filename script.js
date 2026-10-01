const form = document.getElementById("dataForm");
const tableBody = document.getElementById("dataTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const editIndexInput = document.getElementById("editIndex");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");

let records = JSON.parse(localStorage.getItem("dataEntryRecords")) || [];

function saveToStorage() {
  localStorage.setItem("dataEntryRecords", JSON.stringify(records));
}

function renderRecords(search = "") {
  tableBody.innerHTML = "";

  const filtered = records
    .map((record, index) => ({ ...record, originalIndex: index }))
    .filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

  emptyMessage.style.display = filtered.length ? "none" : "block";

  filtered.forEach((record, displayIndex) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${displayIndex + 1}</td>
      <td>${escapeHTML(record.name)}</td>
      <td>${escapeHTML(record.email)}</td>
      <td>${escapeHTML(record.phone)}</td>
      <td>${escapeHTML(record.city)}</td>
      <td>
        <button class="edit" onclick="editRecord(${record.originalIndex})">Edit</button>
        <button class="delete" onclick="deleteRecord(${record.originalIndex})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const record = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim()
  };

  if (!/^\d{10}$/.test(record.phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  const editIndex = editIndexInput.value;

  if (editIndex === "") {
    records.push(record);
  } else {
    records[Number(editIndex)] = record;
  }

  saveToStorage();
  resetForm();
  renderRecords(searchInput.value);
});

function editRecord(index) {
  const record = records[index];

  document.getElementById("name").value = record.name;
  document.getElementById("email").value = record.email;
  document.getElementById("phone").value = record.phone;
  document.getElementById("city").value = record.city;

  editIndexInput.value = index;
  saveBtn.textContent = "Update Entry";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    records.splice(index, 1);
    saveToStorage();
    resetForm();
    renderRecords(searchInput.value);
  }
}

function resetForm() {
  form.reset();
  editIndexInput.value = "";
  saveBtn.textContent = "Save Entry";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", function() {
  renderRecords(this.value);
});

renderRecords();
