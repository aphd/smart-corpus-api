a_2016 <- c(0.0, .01, 3.8)
a_2017 <- c(0.02, 0.13, 5.37)
a_2018 <- c(0.29, 0.75, 5.3)
a_2019 <- c(0.59, 0.99, 5.16)
a_2020 <- c(2.19, 1.59, 5.46)
a_2021 <- c(2.89, 2.12, 5.56)
test <- cbind(a_2016, a_2017, a_2018, a_2019, a_2019, a_2020, a_2021)


barplot(test,beside=T, legend=TRUE)
legend("topright", legend = c("Interfaces", "Libraries", "Contracts"), pch = 15)
