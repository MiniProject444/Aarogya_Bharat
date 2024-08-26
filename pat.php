<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aarogya Bharat</title>
    <link rel="stylesheet" href="pat_style.css">
    <style>
        /* Add hover effects */
        .search-container button[type="button"]:hover {
            background-color: #87d1ff; /* Darker color on hover */
        }

        /* Add this style for images */
        #imageContainer {
            position: fixed;
            bottom: 20px;
            left: 20px;
        }

        .imageWrapper {
            position: relative;
            display: block; /* Change from inline-block to block */
            margin-bottom: 10px; /* Add margin between images */
        }

        .image {
            width: 200px; /* Adjust width as per your preference */
            height: 200px; /* Adjust height as per your preference */
            margin-right: 50px;
        }

        .closeButton {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <div class="banner">
        <div class="logo">
            <a href="index.html">
                <img src="log.png" class="logo">
            </a>
        </div>
        <div class="navbar">
            <ul>
                <li><a href="contact.html">CONTACT US</a></li>
                <li><a href="help.html">HELP</a></li>
            </ul>
        </div>

        <div class="search-container">
            <input type="text" placeholder="Search for doctors by name or specialty.." id="searchInput">
            <button type="button" onclick="searchDoctors()">Search</button>
        </div>

        <div class="button-container">
            <button class="button" onclick="openLoginPage()">View Appointment</button>
            <button class="button" onclick="openBestHospitalPage()">Best Hospital</button>
        </div>

        <div class="container">
            <table>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Doctor Name</th>
                        <th>Specialty</th>
                        <th>Book Appointment</th>
                    </tr>
                </thead>
                <tbody id="doctorTableBody">
                    <tr>
                        <td>1</td>
                        <td><a href="Aayush_profile.html">Dr. Aayush Jadhav</a></td>
                        <td>Neurosurgeon</td>
                        <td><a href="book.php">Book</a></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><a href="Nishant_profile.html">Dr. Nishant Ghare</a></td>
                        <td>Psychiatrist</td>
                        <td><a href="book.php">Book</a></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><a href="Rudy_profile.html">Dr. Rudraraj Bhatawdekar</a></td>
                        <td>Ophthalmologists</td>
                        <td><a href="book.php">Book</a></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td><a href="Kaustubh_profile.html">Dr. Kaustubh Mhatre</a></td>
                        <td>General Physician</td>
                        <td><a href="book.php">Book</a></td>

                    </tr>
                    <tr>
                        <td>4</td>
                        <td><a href="Sarah_profile.html">Dr. Sarah Sharma</a></td>
                        <td>Otolaryngologist</td>
                        <td><a href="book.php">Book</a></td>
                    </tr>


                </tbody>
            </table>
        </div>
    </div>

    <!-- Images with close buttons -->
    <div id="imageContainer">
        <div class="imageWrapper">
            <img src="am.jpg" alt="Image 1" class="image">
            <span class="closeButton" onclick="deleteImage(1)">X</span>
        </div>
        <div class="imageWrapper">
            <img src="an.jpg" alt="Image 2" class="image">
            <span class="closeButton" onclick="deleteImage(2)">X</span>
        </div>
    </div>

    <!-- JavaScript to delete images and handle button clicks -->
    <script>
        function deleteImage(imageId) {
            var imageWrapper = document.querySelector(`#imageContainer .imageWrapper:nth-child(${imageId})`);
            if (imageWrapper) {
                imageWrapper.remove();
            }
        }

        function searchDoctors() {
            // Your existing searchDoctors function
        }

        // Add event listener to search input
        document.getElementById("searchInput").addEventListener("input", function () {
            // Your existing search input event listener
        });

        window.onload = function () {
            // Your existing window.onload function
        };

        // Function to open the login1.php page
        function openLoginPage() {
            window.location.href = "login1.php";
        }

        // Function to open the hos.html page
        function openBestHospitalPage() {
            window.location.href = "hos.html";
        }
    </script>
</body>
</html>
