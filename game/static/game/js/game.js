document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         BEST ERRORは後ほど
         localStorageから読み込む
        */

        const bestErrorElement =
            document.getElementById(
                "best-error"
            );

        const titleScreen =
            document.getElementById(
                "title-screen"
            );

        const gameScreen =
            document.getElementById(
                "game-screen"
            );

        const gameStartButton =
            document.getElementById(
                "game-start-button"
            );

        const productList =
            document.getElementById(
                "product-list"
            );

        const roundNumberElement =
            document.getElementById(
                "round-number"
            );

        const timeLeftElement =
            document.getElementById(
                "time-left"
            );

        const timerBarFill =
            document.getElementById(
                "timer-bar-fill"
            );

        const gameCompleteScreen =
            document.getElementById(
                "game-complete-screen"
            );

        const finalRoundResults =
            document.getElementById(
                "final-round-results"
            );

        const finalTotalError =
            document.getElementById(
                "final-total-error"
            );

        const finalPerfectCount =
            document.getElementById(
                "final-perfect-count"
            );

        const finalRank =
            document.getElementById(
                "final-rank"
            );

        const finalRankMessage =
            document.getElementById(
                "final-rank-message"
            );

        const finalBestError =
            document.getElementById(
                "final-best-error"
            );

        const newRecordMessage =
            document.getElementById(
                "new-record-message"
            );

        const retryButton =
            document.getElementById(
                "retry-button"
            );

        const backTitleButton =
            document.getElementById(
                "back-title-button"
            );

        let productButtons = [];

        const undoButton =
            document.getElementById(
                "undo-button"
            );

        const submitButton =
            document.getElementById(
                "submit-button"
            );

        // =========================
        // BEST ERROR読込
        // =========================

        function loadBestError() {

            try {

                const savedValue =
                    localStorage.getItem(
                        bestErrorStorageKey
                    );

                if (savedValue === null) {
                    return null;
                }

                const parsedValue =
                    Number.parseInt(
                        savedValue,
                        10
                    );

                if (
                    Number.isFinite(parsedValue) &&
                    parsedValue >= 0
                ) {
                    return parsedValue;
                }

            } catch (error) {

                console.warn(
                    "BEST ERRORを読み込めませんでした。",
                    error
                );

            }

            return null;

        }


        // =========================
        // BEST ERROR保存
        // =========================

        function saveBestError(value) {

            try {

                localStorage.setItem(
                    bestErrorStorageKey,
                    String(value)
                );

            } catch (error) {

                console.warn(
                    "BEST ERRORを保存できませんでした。",
                    error
                );

            }

        }


        // =========================
        // BEST ERROR表示更新
        // =========================

        function updateBestErrorDisplay() {

            const displayValue =
                bestError === null
                    ? "---"
                    : bestError.toLocaleString(
                        "ja-JP"
                    ) + "円";

            bestErrorElement.textContent =
                bestError === null
                    ? "🏆 ---"
                    : "🏆 " + displayValue;

            finalBestError.textContent =
                displayValue;

        }

        const roundResultScreen =
            document.getElementById(
                "round-result-screen"
            );

        const resultRating =
            document.getElementById(
                "result-rating"
            );

        const resultTotal =
            document.getElementById(
                "result-total"
            );

        const resultError =
            document.getElementById(
                "result-error"
            );

        const nextRoundButton =
            document.getElementById(
                "next-round-button"
            );

        // =========================
        // ゲーム状態
        // =========================

        const targetAmount = 1000;

        const bestErrorStorageKey =
            "perfect1000BestError";

        let currentRoundIndex = 0;
        let currentTotal = 0;

        let timerId = null;
        let timeLeft = 0;

        let selectedProducts = [];
        let actionHistory = [];
        let roundResults = [];

        let bestError = null;

        // =========================
        // ランダム価格生成
        // =========================

        function generateRandomPrice(
            basePrice,
            priceRange
        ) {

            const minPrice =
                basePrice - priceRange;

            const maxPrice =
                basePrice + priceRange;

            return Math.floor(
                Math.random() *
                (maxPrice - minPrice + 1)
            ) + minPrice;

        }

        // =========================
        // 商品シャッフル
        // =========================

        function shuffleProducts(products) {

            const shuffledProducts =
                [...products];

            for (
                let i = shuffledProducts.length - 1;
                i > 0;
                i--
            ) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );

                [
                    shuffledProducts[i],
                    shuffledProducts[randomIndex]
                ] = [
                    shuffledProducts[randomIndex],
                    shuffledProducts[i]
                ];

            }

            return shuffledProducts;

        }

        // =========================
        // ROUNDデータ
        // =========================

        const rounds = [
            {
                timeLimit: 10,

                products: [
                    {
                        name: "コーヒー",
                        emoji: "☕",
                        basePrice: 400,
                        priceRange: 150
                    },
                    {
                        name: "クロワッサン",
                        emoji: "🥐",
                        basePrice: 258,
                        priceRange: 100
                    },
                    {
                        name: "サンド",
                        emoji: "🥪",
                        basePrice: 362,
                        priceRange: 110
                    },
                    {
                        name: "クッキー",
                        emoji: "🍪",
                        basePrice: 213,
                        priceRange: 80
                    }
                ]
            },
            {
                timeLimit: 9,

                products: [
                    {
                        name: "カフェラテ",
                        emoji: "🥛",
                        basePrice: 463,
                        priceRange: 100
                    },
                    {
                        name: "マフィン",
                        emoji: "🧁",
                        basePrice: 306,
                        priceRange: 120
                    },
                    {
                        name: "紅茶",
                        emoji: "🫖",
                        basePrice: 260,
                        priceRange: 100
                    },
                    {
                        name: "ドーナツ",
                        emoji: "🍩",
                        basePrice: 262,
                        priceRange: 90
                    },
                    {
                        name: "ジュース",
                        emoji: "🧃",
                        basePrice: 207,
                        priceRange: 95
                    }
                ]
            },
            {
                timeLimit: 8,

                products: [
                    {
                        name: "エスプレッソ",
                        emoji: "☕",
                        basePrice: 183,
                        priceRange: 80
                    },
                    {
                        name: "スコーン",
                        emoji: "🥐",
                        basePrice: 240,
                        priceRange: 100
                    },
                    {
                        name: "ケーキ",
                        emoji: "🍰",
                        basePrice: 550,
                        priceRange: 180
                    },
                    {
                        name: "プリン",
                        emoji: "🍮",
                        basePrice: 358,
                        priceRange: 150
                    },
                    {
                        name: "ベーグル",
                        emoji: "🥯",
                        basePrice: 312,
                        priceRange: 120
                    },
                    {
                        name: "ミルク",
                        emoji: "🥛",
                        basePrice: 195,
                        priceRange: 90
                    }
                ]
            },
            {
                timeLimit: 7,

                products: [
                    {
                        name: "チョコ",
                        emoji: "🍫",
                        basePrice: 138,
                        priceRange: 50
                    },
                    {
                        name: "アイス",
                        emoji: "🍨",
                        basePrice: 213,
                        priceRange: 120
                    },
                    {
                        name: "パン",
                        emoji: "🍞",
                        basePrice: 290,
                        priceRange: 130
                    },
                    {
                        name: "ピザ",
                        emoji: "🍕",
                        basePrice: 375,
                        priceRange: 180
                    },
                    {
                        name: "ポテト",
                        emoji: "🍟",
                        basePrice: 234,
                        priceRange: 110
                    },
                    {
                        name: "コーラ",
                        emoji: "🥤",
                        basePrice: 153,
                        priceRange: 60
                    },
                    {
                        name: "アップルパイ",
                        emoji: "🥧",
                        basePrice: 457,
                        priceRange: 200
                    }
                ]
            },

            {
                timeLimit: 6,

                products: [
                    {
                        name: "キャンディ",
                        emoji: "🍬",
                        basePrice: 160,
                        priceRange: 60
                    },
                    {
                        name: "おにぎり",
                        emoji: "🍙",
                        basePrice: 230,
                        priceRange: 110
                    },
                    {
                        name: "ホットドッグ",
                        emoji: "🌭",
                        basePrice: 270,
                        priceRange: 150
                    },
                    {
                        name: "ハンバーガー",
                        emoji: "🍔",
                        basePrice: 340,
                        priceRange: 150
                    },
                    {
                        name: "タコス",
                        emoji: "🌮",
                        basePrice: 310,
                        priceRange: 160
                    },
                    {
                        name: "ワッフル",
                        emoji: "🧇",
                        basePrice: 280,
                        priceRange: 170
                    },
                    {
                        name: "ソフトクリーム",
                        emoji: "🍦",
                        basePrice: 220,
                        priceRange: 110
                    },
                    {
                        name: "ポップコーン",
                        emoji: "🍿",
                        basePrice: 190,
                        priceRange: 90
                    }
                ]
            }
        ];

        // =========================
        // ROUNDの商品を表示
        // =========================

        function renderRound() {

            const round =
                rounds[currentRoundIndex];

            const shuffledProducts =
                shuffleProducts(
                    round.products
                );

            /*
            ROUND番号を更新
            */
            roundNumberElement.textContent =
                "ROUND " +
                (currentRoundIndex + 1) +
                " / " +
                rounds.length;

            /*
            制限時間を表示
            */
            timeLeftElement.textContent =
                round.timeLimit.toFixed(1);

            /*
            前の商品のHTMLを削除
            */
            productList.innerHTML = "";


            /*
            ROUNDの商品を作成
            */
            shuffledProducts.forEach(
                function (product) {

                    const price =
                        product.basePrice !== undefined
                            ? generateRandomPrice(
                                product.basePrice,
                                product.priceRange
                            )
                            : product.price;

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type = "button";

                    button.className =
                        "product-button";

                    button.dataset.price =
                        String(price);

                    button.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                    button.innerHTML =
                        product.emoji +
                        " " +
                        product.name +
                        "<br>" +
                        price.toLocaleString(
                            "ja-JP"
                        ) +
                        "円";

                    button.addEventListener(
                        "click",
                        function () {

                            toggleProduct(
                                button
                            );

                        }
                    );

                    productList.appendChild(
                        button
                    );

                }
            );


            /*
            作成した商品ボタンを取得
            */
            productButtons =
                Array.from(
                    productList.querySelectorAll(
                        ".product-button"
                    )
                );

        }

        // =========================
        // タイマー停止
        // =========================

        function stopTimer() {

            if (timerId !== null) {

                clearInterval(timerId);
                timerId = null;

            }

        }

        // =========================
        // タイマーゲージ更新
        // =========================

        function updateTimerBar() {

            const round =
                rounds[currentRoundIndex];

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            timeLeft /
                            round.timeLimit
                        ) * 100
                    )
                );

            timerBarFill.style.width =
                percentage + "%";

        }

        // =========================
        // タイマー緊迫演出
        // =========================

        function updateTimerState() {

            timeLeftElement.classList.remove(
                "timer-warning",
                "timer-danger",
                "timer-critical"
            );

            timerBarFill.classList.remove(
                "timer-warning",
                "timer-danger",
                "timer-critical"
            );

            if (timeLeft <= 1) {

                timeLeftElement.classList.add(
                    "timer-critical"
                );

                timerBarFill.classList.add(
                    "timer-critical"
                );

            } else if (timeLeft <= 2) {

                timeLeftElement.classList.add(
                    "timer-danger"
                );

                timerBarFill.classList.add(
                    "timer-danger"
                );

            } else if (timeLeft <= 3) {

                timeLeftElement.classList.add(
                    "timer-warning"
                );

                timerBarFill.classList.add(
                    "timer-warning"
                );
            }
        }
        // =========================
        // タイマー開始
        // =========================

        function startTimer() {

            stopTimer();

            const round =
                rounds[currentRoundIndex];

            timeLeft =
                round.timeLimit;

            timeLeftElement.textContent =
                timeLeft.toFixed(1);

            updateTimerState();
            updateTimerBar();

            timerId = setInterval(
                function () {

                    timeLeft -= 0.1;

                    if (timeLeft <= 0) {

                        timeLeft = 0;

                        timeLeftElement.textContent =
                            "0.0";

                        updateTimerState();
                        updateTimerBar();

                        stopTimer();
                        submitRound(true);

                        return;

                    }

                    timeLeftElement.textContent =
                        timeLeft.toFixed(1);

                    updateTimerState();
                    updateTimerBar();

                },
                100
            );

        }

        // =========================
        // ROUND初期化
        // =========================

        function resetRound() {

            currentTotal = 0;

            selectedProducts = [];
            actionHistory = [];

            renderRound();
            updateTotalDisplay();

            startTimer();

        }

        // =========================
        // 金額表示更新
        // =========================

        function updateTotalDisplay() {
            const hasSelection =
                selectedProducts.length > 0;

            submitButton.disabled =
                !hasSelection;

            undoButton.disabled =
                actionHistory.length === 0;

        }

        // =========================
        // 商品選択
        // =========================

        function toggleProduct(button) {

            const price = Number(
                button.dataset.price
            );

            const isSelected =
                button.classList.contains(
                    "selected"
                );

            if (isSelected) {

                button.classList.remove(
                    "selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

                currentTotal -= price;

                selectedProducts =
                    selectedProducts.filter(
                        function (product) {

                            return product !== button;

                        }
                    );

                actionHistory.push({
                    button: button,
                    action: "remove"
                });

            } else {

                button.classList.add(
                    "selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                currentTotal += price;

                selectedProducts.push(
                    button
                );

                actionHistory.push({
                    button: button,
                    action: "add"
                });

            }

            updateTotalDisplay();

        }

        // =========================
        // 最後の操作を戻す
        // =========================

        function undoLastAction() {

            const lastAction =
                actionHistory.pop();

            if (!lastAction) {
                return;
            }

            const button =
                lastAction.button;

            const price = Number(
                button.dataset.price
            );

            if (
                lastAction.action === "add"
            ) {

                button.classList.remove(
                    "selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

                currentTotal -= price;

                selectedProducts =
                    selectedProducts.filter(
                        function (product) {

                            return product !== button;

                        }
                    );

            } else {

                button.classList.add(
                    "selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                currentTotal += price;

                selectedProducts.push(
                    button
                );

            }

            updateTotalDisplay();

        }

        // =========================
        // 評価判定
        // =========================

        function getRating(error) {

            if (error === 0) {
                return "🎯 PERFECT！";
            }

            if (error <= 30) {
                return "✨ GREAT！";
            }

            if (error <= 70) {
                return "👍 GOOD";
            }

            return "😵 MISS";

        }

        // =========================
        // 最終ランク判定
        // =========================

        function getFinalRank(totalError) {

            if (totalError <= 75) {

                return {
                    rank: "S+",
                    message: "ほぼ完璧。驚異の精密さ！"
                };

            }

            if (totalError <= 150) {

                return {
                    rank: "S",
                    message: "かなり正確！すごい暗算力！"
                };

            }

            if (totalError <= 250) {

                return {
                    rank: "A",
                    message: "かなり上手い！"
                };

            }

            if (totalError <= 400) {

                return {
                    rank: "B",
                    message: "なかなかの結果！"
                };

            }

            if (totalError <= 600) {

                return {
                    rank: "C",
                    message: "惜しい！もう少し縮められそう。"
                };

            }

            return {
                rank: "D",
                message: "もう一度挑戦してみよう！"
            };

        }

        // =========================
        // ROUND決定
        // =========================

        function submitRound(
            isTimeUp = false
        ) {

            if (
                selectedProducts.length === 0 &&
                !isTimeUp
            ) {
                return;
            }

            stopTimer();


            /*
            1000円との差を計算
            */
            const error = Math.abs(
                targetAmount - currentTotal
            );

            const rating =
                getRating(error);

            roundResults.push({
                round: currentRoundIndex + 1,
                total: currentTotal,
                error: error,
                rating: rating
            });

            const isFinalRound =
                currentRoundIndex ===
                rounds.length - 1;

            nextRoundButton.textContent =
                isFinalRound
                    ? "RESULT →"
                    : "NEXT ROUND →";

            /*
            結果画面へ表示
            */
            resultTotal.textContent =
                currentTotal.toLocaleString(
                    "ja-JP"
                ) +
                "円";

            resultError.textContent =
                error.toLocaleString(
                    "ja-JP"
                ) +
                "円";

            resultRating.textContent =
                isTimeUp
                    ? "⏰ TIME UP！"
                    : rating;
            
            /*
            結果演出クラスを初期化
            */
            resultRating.classList.remove(
                "result-perfect",
                "result-great",
                "result-good",
                "result-miss",
                "result-timeup",
                "result-pop"
            );


            /*
            今回の結果に合わせてクラス追加
            */
            if (isTimeUp) {

                resultRating.classList.add(
                    "result-timeup"
                );

            } else if (error === 0) {

                resultRating.classList.add(
                    "result-perfect"
                );

            } else if (error <= 30) {

                resultRating.classList.add(
                    "result-great"
                );

            } else if (error <= 70) {

                resultRating.classList.add(
                    "result-good"
                );

            } else {

                resultRating.classList.add(
                    "result-miss"
                );

            }


            /*
            登場アニメーション
            */
            resultRating.classList.add(
                "result-pop"
            );


            /*
            ゲーム画面 → 結果画面
            */
            gameScreen.hidden = true;
            roundResultScreen.hidden = false;
        }

        // =========================
        // 次のROUNDへ進む
        // =========================

        function goToNextRound() {

            const isFinalRound =
                currentRoundIndex ===
                rounds.length - 1;

            if (isFinalRound) {

            showFinalResult();

                return;

            }

            currentRoundIndex += 1;

            roundResultScreen.hidden = true;
            gameScreen.hidden = false;

            resetRound();

        }

        // =========================
        // 最終結果表示
        // =========================

        function showFinalResult() {

            /*
            TOTAL ERRORを計算
            */
            const totalError =
                roundResults.reduce(
                    function (total, result) {

                        return total + result.error;

                    },
                    0
                );


            /*
            PERFECT回数を計算
            */
            const perfectCount =
                roundResults.filter(
                    function (result) {

                        return result.error === 0;

                    }
                ).length;


            /*
            ランク判定
            */
            const rankResult =
                getFinalRank(totalError);


            /*
            各ROUND結果を作成
            */
            finalRoundResults.innerHTML = "";

            roundResults.forEach(
                function (result) {

                    const resultRow =
                        document.createElement(
                            "div"
                        );

                    const perfectMark =
                        result.error === 0
                            ? " 🎯"
                            : "";

                    resultRow.textContent =
                        "ROUND " +
                        result.round +
                        "　誤差 " +
                        result.error.toLocaleString(
                            "ja-JP"
                        ) +
                        "円" +
                        perfectMark;

                    finalRoundResults.appendChild(
                        resultRow
                    );

                }
            );


            /*
            集計結果を表示
            */
            finalTotalError.textContent =
                totalError.toLocaleString(
                    "ja-JP"
                ) +
                "円";

            finalPerfectCount.textContent =
                perfectCount +
                " / " +
                rounds.length;

            finalRank.textContent =
                rankResult.rank;

            finalRankMessage.textContent =
                rankResult.message;

            /*
            最終ランク演出
            */
            finalRank.classList.remove(
                "rank-s-plus",
                "rank-s",
                "rank-a",
                "rank-b",
                "rank-c",
                "rank-d",
                "rank-pop"
            );


            switch (rankResult.rank) {

                case "S+":

                    finalRank.classList.add(
                        "rank-s-plus"
                    );

                    break;


                case "S":

                    finalRank.classList.add(
                        "rank-s"
                    );

                    break;


                case "A":

                    finalRank.classList.add(
                        "rank-a"
                    );

                    break;


                case "B":

                    finalRank.classList.add(
                        "rank-b"
                    );

                    break;


                case "C":

                    finalRank.classList.add(
                        "rank-c"
                    );

                    break;


                default:

                    finalRank.classList.add(
                        "rank-d"
                    );

            }


            finalRank.classList.add(
                "rank-pop"
            );


            /*
            BEST ERROR判定
            
            このゲームは数字が小さいほど
            良い記録
            */
            const isNewRecord =
                bestError === null ||
                totalError < bestError;

            if (isNewRecord) {

                bestError = totalError;

                saveBestError(
                    bestError
                );

            }

            newRecordMessage.hidden =
                !isNewRecord;

            updateBestErrorDisplay();


            /*
            最終結果画面へ切り替え
            */
            roundResultScreen.hidden = true;
            gameScreen.hidden = true;
            gameCompleteScreen.hidden = false;

        }

        // =========================
        // タイトルへ戻る
        // =========================

        function backToTitle() {

            titleScreen.hidden = false;
            gameScreen.hidden = true;    roundResultScreen.hidden = true;
            gameCompleteScreen.hidden = true;

            updateBestErrorDisplay();

        }

        // ========================
        // ゲーム開始
        // ========================

        function startGame() {

            currentRoundIndex = 0;
            roundResults = [];

            newRecordMessage.hidden = true;

            titleScreen.hidden = true;
            gameScreen.hidden = false;
            roundResultScreen.hidden = true;
            gameCompleteScreen.hidden = true;

            resetRound();

        }


        gameStartButton.addEventListener(
            "click",
            startGame
        );


        undoButton.addEventListener(
            "click",
            undoLastAction
        );

        submitButton.addEventListener(
            "click",
            function () {

                submitRound(false);

            }
        );

        nextRoundButton.addEventListener(
            "click",
            goToNextRound
        );

        retryButton.addEventListener(
            "click",
            startGame
        );

        backTitleButton.addEventListener(
            "click",
            backToTitle
        );

        // =========================
        // 初期表示
        // =========================

        bestError =
            loadBestError();

        updateBestErrorDisplay();
    }
);
