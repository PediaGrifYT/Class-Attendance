// Predefined login credentials
const adminID = "aeccseadmin";
const userID = "AEC_CSE@Final";

// Handle login logic
document.getElementById("login-btn").addEventListener("click", () => {
    const loginId = document.getElementById("login-id").value.trim();
    const errorDisplay = document.getElementById("login-error");

    // Hide error message if previously shown
    errorDisplay.classList.add("hidden");

    if (loginId === adminID) {
        document.getElementById("admin-section").classList.remove("hidden");
        document.getElementById("login-section").classList.add("hidden");
    } else if (loginId === userID) {
        document.getElementById("user-section").classList.remove("hidden");
        document.getElementById("login-section").classList.add("hidden");
    } else {
        errorDisplay.classList.remove("hidden");
    }
});

// User Section: Load the student list
window.onload = function() {
    const userStudentList = document.getElementById("user-student-list");

    const students = ["Abinaya","Anbuselvan","Arun Kumar","Bala Chendar","Basker","Danush","Deva Dharshini","Durga Devi","Gayathri","Gopinath","Gowthamen","Hemanth Kumar","Kalivani","Kayal Vizhi","Kiran","Kishore Babu","Lathika","Mani Bharathi","Muthu Kumar","Nithya","Niyamathula","Prakesh","Priya","Priya Bharathi","Ramesh Krishana","Roshan","Rubala","Ruthra Devi","Sanjay Kumar","Santhosh","Sham Praison","Soniya","Srimathi","Subalatha","Subash","Uthaya Bharathi","Varshini","veeramuthu","Vimalya","Yogaraj"];
    students.forEach(student => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${student}</td>
            <td>
                <select class="attendance-status">
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                </select>
            </td>
        `;
        userStudentList.appendChild(row);
    });
};

// Save attendance from User section to localStorage
document.getElementById("user-save-btn").addEventListener("click", () => {
    const attendanceData = [];

    const rows = document.querySelectorAll("#user-student-list tr");
    rows.forEach(row => {
        const studentName = row.cells[0].textContent;
        const status = row.querySelector(".attendance-status").value;
        attendanceData.push({ name: studentName, status: status });
    });

    localStorage.setItem("attendance", JSON.stringify(attendanceData));
    alert("Attendance submitted!");
});

// Admin Section: View saved attendance data
document.getElementById("admin-view-btn").addEventListener("click", () => {
    const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    const displayDiv = document.getElementById("admin-attendance-data");

    displayDiv.innerHTML = "<h3>Saved Attendance Data:</h3>";

    if (attendanceData.length > 0) {
        attendanceData.forEach(record => {
            displayDiv.innerHTML += `<p>${record.name}: ${record.status}</p>`;
        });
    } else {
        displayDiv.innerHTML = "<p>No attendance data found.</p>";
    }
});

// Admin Section: Export attendance data as Excel
document.getElementById("admin-export-btn").addEventListener("click", () => {
    const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
    if (attendanceData.length === 0) {
        alert("No attendance data to export.");
        return;
    }

    // Prepare data for the Excel sheet
    const data = [["Student Name", "Status"]]; // Headers
    attendanceData.forEach(record => {
        data.push([record.name, record.status]);
    });

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Get the current date and time for the filename
    const date = new Date();
    const fileName = `attendance_${date.toISOString().slice(0, 10)}_${date.toTimeString().slice(0, 8).replace(/:/g, '-')}.xlsx`;

    // Export the Excel file
    XLSX.writeFile(wb, fileName);
});

// Admin Section: Reset attendance data
document.getElementById("admin-reset-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset attendance?")) {
        localStorage.removeItem("attendance");
        document.getElementById("admin-attendance-data").innerHTML = '';
        alert("Attendance data reset.");
    }
});
