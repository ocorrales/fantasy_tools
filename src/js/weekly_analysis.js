var myPlayers = [];
var otherPlayers = [];
var matchup = [];
var projections = [];
var projectionTotals;

function injestData(isMyTeam = true){
    var containerDataId = isMyTeam ? 'myTeamvalues' : 'otherTeamvalues';
    var lines = document.getElementById(containerDataId).value.split('\n');
    for(var i = lines.length - 1;i >= 0 ;i--){
        var value = lines[i];
        rawData = getData($.trim(value));
        player = {
            name: rawData[0],
            fgTotals: rawData[1],
            fgPercent: rawData[2],
            ftTotals: rawData[3],
            ftPercent: rawData[4],
            triples: rawData[5],
            points: rawData[6],
            rebounds: rawData[7],
            assists: rawData[8],
            steals: rawData[9],
            blocks: rawData[10],
            tos: rawData[11],
            games: 1
        }
        isMyTeam ? myPlayers.push(player) : otherPlayers.push(player)
    }
    updateAllDataContainers()
}

/**
 *
 * @param tableId css id like '#tableId'
 * @param players an array representation of players
 */
function feedTable(tableId, playerList, isMyTeam=true){
    $( tableId +" tbody tr" ).each( function(){
        this.parentNode.removeChild( this );
    });

    totals = calculateTotals(playerList);

    if(isMyTeam){
        $.each(playerList, function(index, player){
            addElementToTable(tableId, player, false, isMyTeam);
        })
        addElementToTable(tableId,totals, true, isMyTeam)
    }else{
        addElementToTable(tableId,totals, true, isMyTeam)
        $.each(playerList, function(index, player){
            addElementToTable(tableId, player, false, isMyTeam);
        })
    }
}

function calculateTotals(playerList){
    totals = {
        name: 'TOTALS',
        fgTotals: '',
        fgMade: 0,
        fgAttemp: 0,
        fgPercent: 0,
        ftTotals: '',
        ftMade: 0,
        ftAttemp: 0,
        ftPercent: 0,
        triples: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        tos: 0,
        games: 0
    }
    $.each(playerList, function( index, player ) {
        totals.triples += player.games * player.triples;
        totals.points  += player.games * player.points;
        totals.rebounds += player.games * player.rebounds;
        totals.assists += player.games * player.assists;
        totals.steals += player.games * player.steals;
        totals.blocks += player.games * player.blocks;
        totals.tos += player.games * player.tos;
        totals.games += player.games;

        if(!isBlank(player.fgTotals) && !isEmpty(player.fgTotals)){
            var values = player.fgTotals.split('/');
            totals.fgMade = totals.fgMade + (player.games * parseFloat(values[0]));
            totals.fgAttemp = totals.fgAttemp + (player.games * parseFloat(values[1]));
        }

        if(!isBlank(player.ftTotals) && !isEmpty(player.ftTotals)){
            var values = player.ftTotals.split('/');
            totals.ftMade = totals.ftMade + (player.games * parseFloat(values[0]));
            totals.ftAttemp = totals.ftAttemp + (player.games * parseFloat(values[1]));
        }

    });

    totals.fgTotals = totals.fgMade.toFixed(1) + '/' + totals.fgAttemp.toFixed(1);
    totals.fgPercent = (totals.fgMade/totals.fgAttemp).toFixed(3);

    totals.ftTotals = totals.ftMade.toFixed(1) + '/' + totals.ftAttemp.toFixed(1);
    totals.ftPercent = (totals.ftMade/totals.ftAttemp).toFixed(3);

    return totals;

}

function getData(value){
    return value.split("\t");
}

/**
 *
 * @param tableId css id like '#tableId'
 * @param player object representation of the player
 */
function addElementToTable(tableId, player, isTotal, isMyTeam = true){
    var totalClass = isTotal ? "total" : ""
    var trGeneratedId = '<tr id="'+player.name+'" class="'+totalClass+'">'
    var buttons = isTotal ? '' : '<button onclick="addGameToPlayer(\''+player.name+'\',true)">+</button><button onclick="removeGameFromPlayer(\''+player.name+'\',true)">-</button>'


    if(!isMyTeam)
        buttons = isTotal ? '' : '<button onclick="addGameToPlayer(\''+player.name+'\',false)">+</button><button onclick="removeGameFromPlayer(\''+player.name+'\',false)">-</button>'

    $(tableId).find('tbody')
        .append($(trGeneratedId)
            .append($('<td class="playerName">')
                .append(player.name.substr(0,40))
            ).append($('<td class="games">')
                .append(player.games + buttons)
            ).append($('<td class="fgTotals">')
                .append(player.fgTotals)
            ).append($('<td class="fgPercent">')
                .append(player.fgPercent)
            ).append($('<td class="ftTotals">')
                .append(player.ftTotals)
            ).append($('<td class="ftPercent">')
                .append(player.ftPercent)
            ).append($('<td class="triples">')
                .append(parseFloat(player.triples).toFixed(1))
            ).append($('<td class="points">')
                .append(parseFloat(player.points).toFixed(1))
            ).append($('<td class="rebounds">')
                .append(parseFloat(player.rebounds).toFixed(1))
            ).append($('<td class="assists">')
                .append(parseFloat(player.assists).toFixed(1))
            ).append($('<td class="steals">')
                .append(parseFloat(player.steals).toFixed(1))
            ).append($('<td class="blocks">')
                .append(parseFloat(player.blocks).toFixed(1))
            ).append($('<td class="tos">')
                .append(parseFloat(player.tos).toFixed(1))
            )
        );
}

function addGameToPlayer(playerName, isMyTeam=true){
    var playersTableId  = isMyTeam ? '#myTeamSaved' : '#otherTeamSaved';

    if(isMyTeam){
        $.each(myPlayers, function (index, player) {
            if($.trim(player.name) == $.trim(playerName)){
                player.games ++;
            }
        })
    }else{
        $.each(otherPlayers, function (index, player) {
            if($.trim(player.name) == $.trim(playerName)){
                player.games ++;
            }
        })
    }
    updateAllDataContainers();
}

function removeGameFromPlayer(playerName, isMyTeam=true){
    var playersTableId  = isMyTeam ? '#myTeamSaved' : '#otherTeamSaved';

    if(isMyTeam){
        $.each(myPlayers, function (index, player) {
            if($.trim(player.name) == $.trim(playerName)){
                if(player.games > 0)
                    player.games --;
            }
        })
    }else{
        $.each(otherPlayers, function (index, player) {
            if($.trim(player.name) == $.trim(playerName)){
                if(player.games > 0)
                    player.games --;
            }
        })
    }
    updateAllDataContainers();
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function hideShow(containerId){
    $(containerId).toggle();
}

function addNewPlayers(isMyTeam=true){
    var playersTableId  = isMyTeam ? '#myTeamSaved' : '#otherTeamSaved';
    var newPlayerContainerId  = isMyTeam ? 'myTeamAddNewPlayer' : 'otherTeamAddNewPlayer';
    var lines = document.getElementById(newPlayerContainerId).value.split('\n');
    for(var i = lines.length - 1;i >= 0 ;i--){
        var value = lines[i];
        rawData = getData($.trim(value));
        player = {
            name: rawData[0],
            fgTotals: rawData[1],
            fgPercent: rawData[2],
            ftTotals: rawData[3],
            ftPercent: rawData[4],
            triples: rawData[5],
            points: rawData[6],
            rebounds: rawData[7],
            assists: rawData[8],
            steals: rawData[9],
            blocks: rawData[10],
            tos: rawData[11],
            games: 1
        }
        isMyTeam ? myPlayers.push(player) : otherPlayers.push(player);
    }
    // feedTable(playersTableId, isMyTeam ? myPlayers: otherPlayers, isMyTeam)
    updateAllDataContainers();
}

function updateAllDataContainers() {
    feedTable('#myTeamSaved', myPlayers, true);
    feedTable('#otherTeamSaved', otherPlayers, false);
    feedMatchupTable();
    calculateProjections();
    calculateProjectionResults();
    feedProjectionTable();
    printProjectionResults();
}

function getMatchupData(){
    matchup = [];
    var containerDataId = 'matchup';
    var lines = document.getElementById(containerDataId).value.split('\n');
    for(var i = 0;i <= lines.length - 1 ;i++){
        var value = lines[i];
        rawData = getData($.trim(value));
        player = {
            name: rawData[0],
            fgMade: 0,
            fgAttemp: 0,
            ftMade: 0,
            ftAttemp: 0,
            fgTotals: rawData[1],
            fgPercent: rawData[2],
            ftTotals: rawData[3],
            ftPercent: rawData[4],
            triples: rawData[5],
            points: rawData[6],
            rebounds: rawData[7],
            assists: rawData[8],
            steals: rawData[9],
            blocks: rawData[10],
            tos: rawData[11],
            games: 1
        }

        if(!isBlank(player.fgTotals) && !isEmpty(player.fgTotals)){
            var values = player.fgTotals.split('/');
            player.fgMade = parseFloat(values[0]);
            player.fgAttemp = player.games * parseFloat(values[1]);
        }

        if(!isBlank(player.ftTotals) && !isEmpty(player.ftTotals)){
            var values = player.ftTotals.split('/');
            player.ftMade = parseFloat(values[0]);
            player.ftAttemp = parseFloat(values[1]);
        }

        matchup.push(player);
    }
    updateAllDataContainers();
}

function feedMatchupTable(){
    $( "#currentMatchup tbody tr" ).each( function(){
        this.parentNode.removeChild( this );
    });

    $.each(matchup, function(index, player){
        addElementToSummaryTable(player);
    })
}

function addElementToSummaryTable(player, tableId = '#currentMatchup'){
    var trGeneratedId = '<tr id="'+player.name+'">'

    $(tableId).find('tbody')
        .append($(trGeneratedId)
            .append($('<td class="playerName">')
                .append(player.name.substr(0,40))
            ).append($('<td class="games">')
                .append("")
            ).append($('<td class="fgTotals">')
                .append(player.fgTotals)
            ).append($('<td class="fgPercent">')
                .append(player.fgPercent)
            ).append($('<td class="ftTotals">')
                .append(player.ftTotals)
            ).append($('<td class="ftPercent">')
                .append(player.ftPercent)
            ).append($('<td class="triples">')
                .append(parseFloat(player.triples).toFixed(1))
            ).append($('<td class="points">')
                .append(parseFloat(player.points).toFixed(1))
            ).append($('<td class="rebounds">')
                .append(parseFloat(player.rebounds).toFixed(1))
            ).append($('<td class="assists">')
                .append(parseFloat(player.assists).toFixed(1))
            ).append($('<td class="steals">')
                .append(parseFloat(player.steals).toFixed(1))
            ).append($('<td class="blocks">')
                .append(parseFloat(player.blocks).toFixed(1))
            ).append($('<td class="tos">')
                .append(parseFloat(player.tos).toFixed(1))
            )
        );
}

function calculateProjections(){
    projections = [];
    var myTeamTotals = calculateTotals(myPlayers);
    var otherTeamTotals = calculateTotals(otherPlayers);
    if(matchup.length == 0){
        projections.push(myTeamTotals);
        projections.push(otherTeamTotals);
        return projections;
    }

    var myTeamMatchUp = matchup[0];
    var otherTeamMatchUp = matchup[1];
    projections.push(getProjection(myTeamMatchUp, myTeamTotals));
    projections.push(getProjection(otherTeamMatchUp, otherTeamTotals));
}

/**
 * Calculate total from projection to determine probabilities
 * This function MUST BE CALL AFTER calculateProjections()
 */
function calculateProjectionResults(){
    var myTeamProjection = projections[0];
    var otherTeamProjection = projections[1];

    projectionTotals = {
        fgPercentRatio: parseFloat((myTeamProjection.fgPercent / otherTeamProjection.fgPercent).toFixed(2)) ,
        ftPercentRatio: parseFloat((myTeamProjection.ftPercent / otherTeamProjection.ftPercent).toFixed(3)),
        triplesRatio: parseFloat((myTeamProjection.triples / otherTeamProjection.triples).toFixed(2)),
        pointsRatio: parseFloat((myTeamProjection.points / otherTeamProjection.points).toFixed(2)),
        reboundsRatio: parseFloat((myTeamProjection.rebounds / otherTeamProjection.rebounds).toFixed(2)),
        assistsRatio: parseFloat((myTeamProjection.assists / otherTeamProjection.assists).toFixed(2)),
        stealsRatio: parseFloat((myTeamProjection.steals / otherTeamProjection.steals).toFixed(2)),
        blocksRatio: parseFloat((myTeamProjection.blocks / otherTeamProjection.blocks).toFixed(2)),
        tosRatio: parseFloat((myTeamProjection.tos / otherTeamProjection.tos).toFixed(2)),

        fgPercentDifference: parseFloat((myTeamProjection.fgPercent - otherTeamProjection.fgPercent).toFixed(2)),
        ftPercentDifference: parseFloat((myTeamProjection.ftPercent - otherTeamProjection.ftPercent).toFixed(2)),
        triplesDifference: parseFloat((myTeamProjection.triples - otherTeamProjection.triples).toFixed(2)),
        pointsDifference: parseFloat((myTeamProjection.points - otherTeamProjection.points).toFixed(2)),
        reboundsDifference: parseFloat((myTeamProjection.rebounds - otherTeamProjection.rebounds).toFixed(2)),
        assistsDifference: parseFloat((myTeamProjection.assists - otherTeamProjection.assists).toFixed(2)),
        stealsDifference: parseFloat((myTeamProjection.steals - otherTeamProjection.steals).toFixed(2)),
        blocksDifference: parseFloat((myTeamProjection.blocks - otherTeamProjection.blocks).toFixed(2)),
        tosDifference: parseFloat((myTeamProjection.tos - otherTeamProjection.tos).toFixed(2))
    }

    projectionTotals.myTeamCategories =
        isFavorableCategory(projectionTotals.fgPercentRatio) +
        isFavorableCategory(projectionTotals.ftPercentRatio) +
        isFavorableCategory(projectionTotals.triplesRatio) +
        isFavorableCategory(projectionTotals.pointsRatio) +
        isFavorableCategory(projectionTotals.reboundsRatio) +
        isFavorableCategory(projectionTotals.assistsRatio) +
        isFavorableCategory(projectionTotals.stealsRatio) +
        isFavorableCategory(projectionTotals.blocksRatio) +
        isFavorableCategory(projectionTotals.tosRatio, false);

    projectionTotals.otherTeamCategories =
        isFavorableCategory(projectionTotals.fgPercentRatio,false) +
        isFavorableCategory(projectionTotals.ftPercentRatio,false) +
        isFavorableCategory(projectionTotals.triplesRatio,false) +
        isFavorableCategory(projectionTotals.pointsRatio,false) +
        isFavorableCategory(projectionTotals.reboundsRatio,false) +
        isFavorableCategory(projectionTotals.assistsRatio,false) +
        isFavorableCategory(projectionTotals.stealsRatio,false) +
        isFavorableCategory(projectionTotals.blocksRatio,false) +
        isFavorableCategory(projectionTotals.tosRatio);
}

/**
 * Return 1 if category ratio is > 1, 0 otherwise, unless havingMoreIsBetter param is false
 * @param categoryRatio
 * @param havingMoreIsBetter
 * @returns 1|0
 */
function isFavorableCategory(categoryRatio, havingMoreIsBetter = true){
    if(havingMoreIsBetter){
        if(categoryRatio > 1){
            return 1;
        } else {
            return 0;
        }
    }else{
        if(categoryRatio < 1){
            return 1;
        } else {
            return 0;
        }
    }
}


function getProjection(teamMatchUp, teamTotals) {
    projection = {
        name: teamMatchUp.name,
        fgTotals: '',
        fgMade: parseFloat(teamMatchUp.fgMade) + parseFloat(teamTotals.fgMade),
        fgAttemp: parseFloat(teamMatchUp.fgAttemp) + parseFloat(teamTotals.fgAttemp),
        fgPercent: 0,
        ftTotals: '',
        ftMade: parseFloat(teamMatchUp.ftMade) + parseFloat(teamTotals.ftMade),
        ftAttemp: parseFloat(teamMatchUp.ftAttemp) + parseFloat(teamTotals.ftAttemp),
        ftPercent: 0,
        triples: parseFloat(teamMatchUp.triples) + parseFloat(teamTotals.triples),
        points: parseFloat(teamMatchUp.points) + parseFloat(teamTotals.points),
        rebounds: parseFloat(teamMatchUp.rebounds) + parseFloat(teamTotals.rebounds),
        assists: parseFloat(teamMatchUp.assists) + parseFloat(teamTotals.assists),
        steals: parseFloat(teamMatchUp.steals) + parseFloat(teamTotals.steals),
        blocks: parseFloat(teamMatchUp.blocks) + parseFloat(teamTotals.blocks),
        tos: parseFloat(teamMatchUp.tos) + parseFloat(teamTotals.tos),
        games: teamTotals.games
    }

    projection.fgTotals = projection.fgMade.toFixed(1) + '/' + projection.fgAttemp.toFixed(1);
    projection.fgPercent = (projection.fgMade / projection.fgAttemp).toFixed(3);

    projection.ftTotals = projection.ftMade.toFixed(1) + '/' + projection.ftAttemp.toFixed(1);
    projection.ftPercent = (projection.ftMade / projection.ftAttemp).toFixed(3);

    return projection;
}

function feedProjectionTable(){
    $( "#projection tbody tr" ).each( function(){
        this.parentNode.removeChild( this );
    });

    $.each(projections, function(index, player){
        addElementToSummaryTable(player, '#projection');
    })
}

function printProjectionResults(){
    var myTeamTr = $("#projection tbody tr:nth-child(1)");
    var otherTeamTr = $("#projection tbody tr:nth-child(2)");

    //set totals. PS: using "games" td as a hack, but it should be displayed in his own td
    myTeamTr.find("td.games").html(projectionTotals.myTeamCategories);
    otherTeamTr.find("td.games").html(projectionTotals.otherTeamCategories);

    //modifying fgPercent
    if(projectionTotals.fgPercentRatio > 1){
        myTeamTr.find("td.fgPercent").addClass("boldText");
    }

    if(projectionTotals.fgPercentRatio < 1){
        otherTeamTr.find("td.fgPercent").addClass("boldText");
    }

    //modifying ftPercent
    if(projectionTotals.ftPercentRatio > 1){
        myTeamTr.find("td.ftPercent").addClass("boldText");
    }

    if(projectionTotals.ftPercentRatio < 1){
        otherTeamTr.find("td.ftPercent").addClass("boldText");
    }

    //modifying triples
    if(projectionTotals.triplesRatio > 1){
        myTeamTr.find("td.triples").addClass("boldText");
    }

    if(projectionTotals.triplesRatio < 1){
        otherTeamTr.find("td.triples").addClass("boldText");
    }

    //modifying points
    if(projectionTotals.pointsRatio > 1){
        myTeamTr.find("td.points").addClass("boldText");
    }

    if(projectionTotals.pointsRatio < 1){
        otherTeamTr.find("td.points").addClass("boldText");
    }

    //modifying rebounds
    if(projectionTotals.reboundsRatio > 1){
        myTeamTr.find("td.rebounds").addClass("boldText");
    }

    if(projectionTotals.reboundsRatio < 1){
        otherTeamTr.find("td.rebounds").addClass("boldText");
    }

    //modifying assists
    if(projectionTotals.assistsRatio > 1){
        myTeamTr.find("td.assists").addClass("boldText");
    }

    if(projectionTotals.assistsRatio < 1){
        otherTeamTr.find("td.assists").addClass("boldText");
    }

    //modifying steals
    if(projectionTotals.stealsRatio > 1){
        myTeamTr.find("td.steals").addClass("boldText");
    }

    if(projectionTotals.stealsRatio < 1){
        otherTeamTr.find("td.steals").addClass("boldText");
    }

    //modifying blocks
    if(projectionTotals.blocksRatio > 1){
        myTeamTr.find("td.blocks").addClass("boldText");
    }

    if(projectionTotals.blocksRatio < 1){
        otherTeamTr.find("td.blocks").addClass("boldText");
    }

    //modifying tos
    if(projectionTotals.tosRatio < 1){
        myTeamTr.find("td.tos").addClass("boldText");
    }

    if(projectionTotals.tosRatio > 1){
        otherTeamTr.find("td.tos").addClass("boldText");
    }
}