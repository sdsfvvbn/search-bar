// $(document).ready(function () {
//     $(".search-bar").on("keypress", function (e) {
//         if (e.which === 13) {  //Enter
//             e.preventDefault(); // 阻止表單提交和頁面重新加載
//             search_func();
//         }
//     });

//     $(".button").on("click", function (e) {
//         e.preventDefault(); 
//         search_func();
//     });

//     function search_func() {
//         let query = $(".search-bar").val().toLowerCase();
//         $("#result").empty(); 

//         if (query === "") {
//             $("#more").hide();
//             return;
//         }

//         let filtered = SEARCH_DATASET.filter(item =>
//             item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)
//         );

//         function appendresult(item) {
//             $("#result").append(`
//                 <div class="result-item">
//                 <div class="result-header">
//                     <div class="result-url"><a href="${item.url}" target="_blank">${item.url}</a></div>                 
//                     <div class="result-title"><a class="result-title" href="${item.url}" target="_blank">${item.title}</a></div>
//                     <div class="result-popularity">人氣: ${item.popularity}
//                 </div>
//                     <span class="result-date">${item.created_at.substring(0, 10)}</span>
//                     <span class="result-text">${item.text}</span>                  
//                     <br><br><br>      
//                 </div>
//             `);
//         }//end appendresult

//         let counter = 0;

//         filtered.forEach(item => {
//             counter++;

//             if (counter % 10 ===0) {
//                 $("#more").show();
//                 $(".space").show();
//                 return;
//             };
//             appendresult(item);
//         });

//         //排序
//         $("#filter").off("change").on("change", function () {
//             let switchValue = $(this).val();
//             switch (switchValue) {
//                 case "date":
//                     filtered.sort(function (a, b) {
//                         return new Date(b.created_at) - new Date(a.created_at);
//                     });
//                     break;
//                 case "title":
//                     filtered.sort(function (a, b) {
//                         return a.title.localeCompare(b.title);
//                     });
//                     break;
//                 case "pop":
//                     filtered.sort(function (a, b) {
//                         return b.popularity - a.popularity;
//                     });
//                     break;
//                 default:
//                     break;
//             }//end switch

//             $("#result").empty();
//             let counter = 0;
//             filtered.forEach(item => {

//                 counter++;
//                 if (counter % 10 ===0) {
//                     $("#more").show();
//                     $(".space").show();
//                     return;
//                 }
//                 appendresult(item);
//             });
//         });//end change

//         $("#count").text(filtered.length);
//         let times = 0;
//         $("#more").off("click").on("click", function () {
//             let t = times+1;
//             let start = 10*t;
//             times++;
//             for (let i = start; i < start+10; i++) {
//                 let item = filtered[i];
//                 appendresult(item);
//             }
//             if (start + 10 >= filtered.length) {                
//                 $("#more").hide();
//             }
//         });

//         $("#result").off("mouseover", ".result-title").on("mouseover", ".result-title", function () {
//             $(this).css("text-decoration", "underline");
//         });

//         $("#result").off("mouseout", ".result-title").on("mouseout", ".result-title", function () {
//             $(this).css("text-decoration", "none");
//         });
//     }//end search_func
// });

$(document).ready(function () {
    $(".search-bar").on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
            search_func();
        }
    });

    $(".button").on("click", function (e) {
        e.preventDefault();
        search_func();
    });
    $(".title").on("click", function (e) {
        e.preventDefault();
        $(".search-bar").val("");
        $("#result").empty();
        $("#more").hide();
        $(".space").hide();
        $("#count").text("0");
        $("#filter").val("title"); 
    });

    function search_func() {
        let query = $(".search-bar").val().toLowerCase();
        $("#result").empty();

        if (query === "") {
            return;
        }
        let filtered = SEARCH_DATASET.filter(item =>
            item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query)
        );

        filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const queryLower = query.toLowerCase();
            const aMatchCount = (aTitle.match(new RegExp(queryLower, "g")) || []).length;
            const bMatchCount = (bTitle.match(new RegExp(queryLower, "g")) || []).length;
            const aFirstPos = aTitle.indexOf(queryLower);
            const bFirstPos = bTitle.indexOf(queryLower);

            if (aMatchCount !== bMatchCount) {
                return bMatchCount - aMatchCount;
            }
            if (aFirstPos !== bFirstPos) {
                return aFirstPos - bFirstPos;
            }
            return aTitle.localeCompare(bTitle);
        });


        function appendresult(item) {
            $("#result").append(`
                <div class="result-item">
                    <div class="result-header">
                        <div class="result-url"><a href="${item.url}" target="_blank">${item.url}</a></div>                 
                        <div class="result-title"><a class="result-title" href="${item.url}" target="_blank">${item.title}</a></div>
                        <div class="result-popularity">人氣: ${item.popularity}</div>
                    </div>
                    <span class="result-date">${item.created_at.substring(0, 10)}</span>
                    <span class="result-text">${item.text}</span>                  
                    <br><br><br>      
                </div>
            `);
        }

        let times = 0;
        let page = 10;

        function showNextResults() {
            let start = times * page;
            let end = Math.min(start + page, filtered.length);
            for (let i = start; i < end; i++) {
                appendresult(filtered[i]);
            }
            times++;

            if (end >= filtered.length) {
                $("#more").hide();
            } else {
                $("#more").show();
                $(".space").show();
            }
        }
        showNextResults();

        $("#filter").off("change").on("change", function () {
            let switchValue = $(this).val();
            let currentTimes = times; //current page
            switch (switchValue) {
                case "date":
                    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case "title":
                    // filtered.sort((a, b) => a.title.localeCompare(b.title));
                    filtered.sort((a, b) => {
                        const aTitle = a.title.toLowerCase();
                        const bTitle = b.title.toLowerCase();
                        const queryLower = query.toLowerCase();

                        //關鍵字出縣次數
                        const aMatchCount = (aTitle.match(new RegExp(queryLower, "g")) || []).length;
                        const bMatchCount = (bTitle.match(new RegExp(queryLower, "g")) || []).length;

                        // 計算關鍵字在標題中第一次出現的位置
                        const aFirstPos = aTitle.indexOf(queryLower);
                        const bFirstPos = bTitle.indexOf(queryLower);

                        // 排序邏輯：
                        // 1. 關鍵字出現次數多的優先
                        // 2. 如果次數相同，比較第一次出現的位置，越靠前越相關
                        // 3. 如果位置相同，再以標題字母排序
                        if (aMatchCount !== bMatchCount) {
                            return bMatchCount - aMatchCount;
                        }
                        if (aFirstPos !== bFirstPos) {
                            return aFirstPos - bFirstPos;
                        }
                        return aTitle.localeCompare(bTitle);
                    });
                    break;
                case "pop":
                    filtered.sort((a, b) => b.popularity - a.popularity);
                    break;
                default:
                    break;
            }

            $("#result").empty();

            times = 0;
            for (let i = 0; i < currentTimes; i++) {
                showNextResults();
            }
            if (times * page < filtered.length) {
                $("#more").show();
                $(".space").show();
            } else {
                $("#more").hide();
                $(".space").hide();
            }

        });




        $("#more").off("click").on("click", function () {
            showNextResults();
        });

        $("#count").text(filtered.length);

        $("#result").off("mouseover", ".result-title").on("mouseover", ".result-title", function () {
            $(this).css("text-decoration", "underline");
        });

        $("#result").off("mouseout", ".result-title").on("mouseout", ".result-title", function () {
            $(this).css("text-decoration", "none");
        });
    }
});



