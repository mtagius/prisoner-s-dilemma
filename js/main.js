results = null;
game = 1
playerChoices = ["", ""];
computerChoices = ["", ""];
playerYears = [0, 0];
computerYears = [0, 0];
timeout = false;

function saveNewResults() {
    $.ajax({
        url: "php/save.php",
        type: "POST",
        data: results,
        success: function(result){
            console.log("New Results Saved to Sever!");
        }
    });
}

function loadResults() {
    console.log(playerChoices);
    console.log(computerChoices);

    for(var i = 0; i < 2; i++) {
        if(playerChoices[i] == computerChoices[i]) {
            if(playerChoices[i] == "betray") {
                playerYears[i] = 2;
                computerYears[i] = 2;
            } else {
                playerYears[i] = 1;
                computerYears[i] = 1;
            }
        } else {
            if(playerChoices[i] == "betray") {
                playerYears[i] = 0;
                computerYears[i] = 3;
            } else {
                playerYears[i] = 3;
                computerYears[i] = 0;
            }
        }
    }

    if(playerChoices[0] == "betray") {
        results.ethicalEgoism.playerBetrays = parseInt(results.ethicalEgoism.playerBetrays, 10) + 1;
        results.ethicalEgoism.totalYearsPlayerBetray = parseInt(results.ethicalEgoism.totalYearsPlayerBetray, 10) + playerYears[0];
    } else {
        results.ethicalEgoism.playerSilent = parseInt(results.ethicalEgoism.playerSilent, 10) + 1;
        results.ethicalEgoism.totalYearsPlayerSilent = parseInt(results.ethicalEgoism.totalYearsPlayerSilent, 10) + playerYears[0];
    }
    if(computerChoices[0] == "betray") {
        results.ethicalEgoism.computerBetrays = parseInt(results.ethicalEgoism.computerBetrays, 10) + 1;
        results.ethicalEgoism.totalYearsComputerBetray = parseInt(results.ethicalEgoism.totalYearsComputerBetray, 10) + computerYears[0];
    } else {
        results.ethicalEgoism.computerSilent = parseInt(results.ethicalEgoism.computerSilent, 10) + 1;
        results.ethicalEgoism.totalYearsComputerSilent = parseInt(results.ethicalEgoism.totalYearsComputerSilent, 10) + computerYears[0];
    }
    if(playerChoices[1] == "betray") {
        results.socialContractTheory.playerBetrays = parseInt(results.socialContractTheory.playerBetrays, 10) + 1;
        results.socialContractTheory.totalYearsPlayerBetray = parseInt(results.socialContractTheory.totalYearsPlayerBetray, 10) + playerYears[1];
    } else {
        results.socialContractTheory.playerSilent = parseInt(results.socialContractTheory.playerSilent, 10) + 1;
        results.socialContractTheory.totalYearsPlayerSilent = parseInt(results.socialContractTheory.totalYearsPlayerSilent, 10) + playerYears[1];
    }
    if(computerChoices[1] == "betray") {
        results.socialContractTheory.computerBetrays = parseInt(results.socialContractTheory.computerBetrays, 10) + 1;
        results.socialContractTheory.totalYearsComputerBetray = parseInt(results.socialContractTheory.totalYearsComputerBetray, 10) + computerYears[1];
    } else {
        results.socialContractTheory.computerSilent = parseInt(results.socialContractTheory.computerSilent, 10) + 1;
        results.socialContractTheory.totalYearsComputerSilent = parseInt(results.socialContractTheory.totalYearsComputerSilent, 10) + computerYears[1];
    }

    $.get("html/results.html", function(data){
        $("#mainContainer").html(data);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        if(playerChoices[0] == "betray") {
            $("#eePlayer").html("You <span class='important'>Betrayed.</span>");
        } else {
            $("#eePlayer").html("You <span class='important'>Remained Silent.</span>");
        }
        if(computerChoices[0] == "betray") {
            $("#eeComp").html("The Computer <span class='important'>Betrayed.</span>");
        } else {
            $("#eeComp").html("The Computer <span class='important'>Remained Silent.</span>");
        }
        $("#eePlayerYears").html("You went to jail for <span class='important'>" + playerYears[0] + " years.</span>");
        $("#eeCompYears").html("The Computer went to jail for <span class='important'>" + computerYears[0] + " years.</span>");

        if(playerChoices[1] == "betray") {
            $("#sctPlayer").html("You <span class='important'>Betrayed.</span>");
        } else {
            $("#sctPlayer").html("You <span class='important'>Remained Silent.</span>");
        }
        if(computerChoices[1] == "betray") {
            $("#sctComp").html("The Computer <span class='important'>Betrayed.</span>");
        } else {
            $("#sctComp").html("The Computer <span class='important'>Remained Silent.</span>");
        }
        $("#sctPlayerYears").html("You went to jail for <span class='important'>" + playerYears[1] + " years.</span>");
        $("#sctCompYears").html("The Computer went to jail for <span class='important'>" + computerYears[1] + " years.</span>");
    });

    saveNewResults();
}

function ethicalEgoism(choice) {
    timeout = true;
    setTimeout(function() {
        timeout = false;
    }, 1000);
    playerChoices[0] = choice;
    adverageYearsBetray = (parseInt(results.ethicalEgoism.totalYearsComputerBetray, 10) / parseInt(results.ethicalEgoism.computerBetrays, 10));
    adverageYearsSilent = (parseInt(results.ethicalEgoism.totalYearsComputerSilent, 10) / parseInt(results.ethicalEgoism.computerSilent, 10));
    if(adverageYearsBetray <= adverageYearsSilent) {
        computerChoices[0] = "betray";
    } else {
        computerChoices[0] = "remain silent";
    }
    game += 1;
    $("#gameText").html("Currently playing game <span class='important'>2 of 2.</span>");
    if(playerChoices[0] == "betray") {
        $("#gamePopup").html("You choose to <span class='important'>Betray.</span>  Make your move for the second game.");
    } else {
        $("#gamePopup").html("You choose to <span class='important'>Remain Silent.</span>  Make your move for the second game.");    }
}

function socialContractTheory(choice) {
    playerChoices[1] = choice;
    computerChoices[1] = "remain silent";
    game += 1;
    loadResults();
}

$(document).ready(function() {
    $.getJSON("data/results.json?nocache="+new Date(), function(json) {
        results = json;
        console.log("Received Results From Server!");
    });
    $("#betray").on('click touchstart', function() {
        if(results != null  && timeout == false) {
            if(game == 1) {
                ethicalEgoism("betray");
            } else if (game == 2) {
                socialContractTheory("betray");
            }
        }
    });
    $("#remainSilent").on('click touchstart', function() {
        if(results != null  && timeout == false) {
            if(game == 1) {
                ethicalEgoism("remain silent");
            } else if (game == 2) {
                socialContractTheory("remain silent");
            }
        }
    });
});