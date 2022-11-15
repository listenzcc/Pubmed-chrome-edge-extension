/*
File: addon.js
Purpose: Add <div> for every search results in the "https://pubmed.ncbi.nlm.nih.gov/?term*" website.
*/

console.log("PubmedExt addon.js starts");

window.onload = main();

function main() {
    const results = document.getElementsByClassName("docsum-wrap");
    console.log(results);

    for (let i = 0; i < results.length; i++) {
        const entry = results[i];

        // Continue if titleDiv doesn't exist
        const titleDivs = entry.getElementsByClassName("docsum-title");
        if (!titleDivs) continue;
        const titleDiv = titleDivs[0];

        // Continue if snippet doesn't exist
        const snippetDivs = entry.getElementsByClassName("full-view-snippet");
        if (!snippetDivs) continue;
        const snippetDiv = snippetDivs[0];

        // Get href url
        const hrefUrl = d3.select(titleDiv).attr("href");

        $.ajax({
            url: hrefUrl,
            success: function (data) {
                const newDiv = entry.appendChild(document.createElement("div"));
                const newDiv2 = entry.appendChild(
                    document.createElement("div")
                );
                d3.select(newDiv)
                    .attr(
                        "style",
                        "height: 500px; overflow-y: scroll; border: solid gray; width: fit-content; display: none"
                    )
                    .attr("class", "ccAddonCollapseAbleDetail");

                d3.select(newDiv2)
                    .attr(
                        "style",
                        "width: fit-content; border-left: solid pink"
                    )
                    .attr("class", "ccAddonCollapseAbleDetail");

                // Prevent the div to be displayed,
                // it is no good for keeping it.
                newDiv.innerHTML = data.replace(
                    "Skip to main page content",
                    ""
                );

                const t0 = newDiv.getElementsByClassName("full-text-links")[0];
                newDiv2.innerHTML = t0
                    ? t0.outerHTML.replaceAll("Full text links", "")
                    : "";

                // Add click callback
                {
                    const sd = d3.select(snippetDiv);
                    sd.attr("style", () => "border-left: solid pink");
                    sd.on("click", (e) => {
                        console.log("Clicked snippet", e);
                        const dsp = newDiv.style.display;
                        sd.attr(
                            "style",
                            () =>
                                "border-left: " +
                                (dsp ? "solid gray" : "solid pink")
                        );
                        newDiv.style.display = dsp ? "" : "none";
                    });
                }
            },
        });
    }
}
