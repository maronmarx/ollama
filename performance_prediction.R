# nolint start
args <- commandArgs(trailingOnly = TRUE)
tableName <- args[1]
nomProject <- args[2]
repProject <- args[3]

prediction <- function(tableName, nomProject, repProject) {
  output <- tryCatch({
    # Extract the part before the last "/"
    repProjectDisplay <- sub("/[^/]*$", "", repProject)
    repProjectDisplay <- sub("^.*/", "", repProjectDisplay)

    # Afficher les paramètres pour le débogage
    print(paste("tableName:", tableName))
    print(paste("nomProject:", nomProject))
    print(paste("repProject:", repProjectDisplay))

    # Charger les packages nécessaires
    library(officer)
    library(magrittr)

    # Créer un document Word avec un paragraphe
    doc <- read_docx() %>%
      body_add_par("Ceci est un paragraphe dans un fichier Word", style = "Normal")

    # Chemin du fichier à enregistrer
    filePath <- file.path(repProject, "rapport.docx")

    # Enregistrer le document Word
    print(doc, target = filePath)

    # Retourner un message de succès
    "La création du modèle prédictif est exécuté avec succès"
  }, error = function(e) {
    # Gérer l'erreur
    paste("Une erreur s'est produite lors de l'exécution de la modélisation :", e$message)
  })

  # Retourner le résultat
  return(output)
}

# Appeler la fonction prediction avec les arguments fournis
result <- prediction(tableName, nomProject, repProject)
cat(result)
# nolint end