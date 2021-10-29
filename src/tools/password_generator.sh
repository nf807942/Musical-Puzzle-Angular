#!/bin/sh
echo Nouveau mot de passe ?
read varname
echo -n "$varname" | md5sum | awk '{print $1}' | tr -d '\n' > ../password
echo Mot de passe généré