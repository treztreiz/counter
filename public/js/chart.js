$(function () {

    var url = Routing.generate('project_sessions', { id: $('#myChart').data('id') });
    $.post(url, function(data) {

        var chartData = [];
        for( var i = 0; i < data.length; i++ ) {
            var h = Math.floor( data[i].time / 3600 );
            var m =  Math.floor( data[i].time % 3600 / 60 );
            chartData.push({ x: new Date( data[i].date ).setHours(0,0,0,0), y: data[i].time });
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Temps de travail',
                    backgroundColor: '#525252',
                    borderColor: '#525252',
                    fill: false,
                    data: chartData,
                }]
            },
            options: {
				responsive: true,
				title: {
					display: false
				},
				scales: {
					xAxes: [{
						type: 'time',
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
                        },
                        time: {
                            unit: 'day',
                            displayFormats: {
                                quarter: 'MMM YYYY'
                            }
                        },
						ticks: {
							major: {
								fontStyle: 'bold',
								fontColor: '#525252'
							}
						}
					}],
					yAxes: [{
                        display: true,
						scaleLabel: {
							display: true,
							labelString: 'Temps de travail'
                        },
                        time: {
                            unit: 'second',
                            displayFormats: {
                                quarter: 'MMM YYYY'
                            }
                        },
                        ticks: {
                            userCallback: function(v) { return epoch_to_hh_mm_ss(v) },
                            stepSize: 60 * 60,
                            beginAtZero: true
                        },
					}]
                },
                tooltips: {
                    xDateFormat: '%Y-%m-%d',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return epoch_to_hh_mm_ss(tooltipItem.yLabel)
                        },
                        title: () => { return ""; }
                    }
                }
			}
        });

        function epoch_to_hh_mm_ss(epoch) {
            var h = Math.floor( epoch / 3600 );
            var m =  Math.floor( epoch % 3600 / 60 );
            if( m < 10 ) m += "0";
            return h + ":" + m;
        }

    });
    

});