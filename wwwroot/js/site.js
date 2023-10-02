﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$("#json").change(async function () {
    $(".alert-danger").addClass("visually-hidden");
    const value = $(this).val();
    try {
        await generateView(value);
    } catch (error) {
        $(".alert-danger").removeClass("visually-hidden");
        $(".alert-danger").text(error.message);
    }
})

$(document).ready(function () {
    $("#download").click(function () {
        window.jsPDF = window.jspdf.jsPDF
        var content = $("#previewPDF")[0];
        const contentWidth  = content.offsetWidth;

        // Create a new jsPDF instance
        const pdf = new jsPDF({
            unit: "px",
            format: [contentWidth , 792] // 792 is the height of A4 in pixels
        });

        pdf.html(content, {
            callback: function (pdf) {
                pdf.save("a4.pdf");
            },
            y: 20,
        });
    })
})

async function isArray(data) {
    const jsonData = JSON.parse(data);

    return Array.isArray(jsonData) ? true : false;
}


async function generateView(json) {
    const jsonData = JSON.parse(json);
    let html = ``;

    if (!await isArray(json)) {
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const data = jsonData[key];
                html += await generateTable(key, JSON.stringify(data));
            }
        }
    }

    $("#previewPDF").html(html);
}

async function generateTable(title, data) {
    const jsonData = JSON.parse(data);
    let tbody = ``;

    if (!await isArray(data)) {
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const data = jsonData[key];
                tbody += `
                    <tr>
                        <td>${key}</td>
                        <td>${data}</td>
                    </tr>
                `;
            }
        }
    } else {
        // set header for array table
        tbody += `<tr>`;
        const firstArray = jsonData[0];
        for (const key in firstArray) {
            if (firstArray.hasOwnProperty(key)) {
                tbody += ` <td>${key}</td>`;
            }
        }
        tbody += '</tr>';

        jsonData.forEach(element => {
            tbody += `<tr>`;
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    tbody += ` <td>${element[key]}</td>`;
                }
            }
            tbody += '</tr>';
        });
    }

    return `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">${title}</th>
                </tr>
            </thead>
            <tbody>
                ${tbody}
            </tbody>
        </table>
    `;
}