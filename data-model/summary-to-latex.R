# remove all the lines with the field n/a by running on bash this command
# sed -n '/n\/a/!p' ./data/metrics.sort.uniq.csv > /tmp/metrics.sort.uniq.csv

df <- read.csv("/tmp/metrics.sort.uniq.csv", stringsAsFactors = T)
sdf <- subset( df, select = -rawVersion )
sdf <- subset( sdf, select = -contractAddress )
sdf <- subset( sdf, select = -version )
stargazer(sdf)
