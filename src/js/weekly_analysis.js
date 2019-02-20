var players = [];

function injestData(){
    var lines = document.getElementById('values').value.split('\n');
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
        players.push(player);
    }
    feedTable('#myTeamSaved', players)
}

/**
 *
 * @param tableId css id like '#tableId'
 * @param players an array representation of players
 */
function feedTable(tableId, players){
    $( tableId +" tbody tr" ).each( function(){
        this.parentNode.removeChild( this );
    });

    $.each(players, function(index, player){
        addElementToTable(tableId, player, false);
    })
    totals = calculateTotals(players);
    addElementToTable(tableId,totals, true)
}

function calculateTotals(players){
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
    $.each(players, function( index, player ) {
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
            totals.fgMade = totals.fgMade + parseFloat(values[0]);
            totals.fgAttemp = totals.fgAttemp + parseFloat(values[1]);
        }

        if(!isBlank(player.ftTotals) && !isEmpty(player.ftTotals)){
            var values = player.ftTotals.split('/');
            totals.ftMade = totals.ftMade + parseFloat(values[0]);
            totals.ftAttemp = totals.ftAttemp + parseFloat(values[1]);
        }

    });

    totals.fgTotals = totals.fgMade + '/' + totals.fgAttemp;
    totals.fgPercent = (totals.fgMade/totals.fgAttemp).toFixed(3);

    totals.ftTotals = totals.ftMade + '/' + totals.ftAttemp;
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
function addElementToTable(tableId, player, isTotal){
    var totalClass = isTotal ? "total" : ""
    var trGeneratedId = '<tr id="'+player.name+'" class="'+totalClass+'">'
    var buttons = isTotal ? '' : '<button onclick="addGameToPlayer(\''+player.name+'\')">+</button><button onclick="removeGameFromPlayer(\''+player.name+'\')">-</button>'
    $(tableId).find('tbody')
        .append($(trGeneratedId)
            .append($('<td class="playerName">')
                .append(player.name)
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

function addGameToPlayer(playerName){
    $.each(players, function (index, player) {
        if($.trim(player.name) == $.trim(playerName)){
            player.games ++;
        }
    })
    feedTable('#myTeamSaved', players)
}

function removeGameFromPlayer(playerName){
    $.each(players, function (index, player) {
        if(player.name == playerName){
            if(player.games > 0)
                player.games --;
        }
    })
    feedTable('#myTeamSaved', players)
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}