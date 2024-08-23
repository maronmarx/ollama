# nolint start
args <- commandArgs(trailingOnly = TRUE)
tableName <- args[1]
nomProject <- args[2]
projectDirectory <- args[3]
nbrModels <- ifelse(length(args) > 3, as.numeric(args[4]), NA)

prediction <- function(tableName, nomProject, projectDirectory, nbrModels = NA) {
  output <- tryCatch(
    {
      # Extract the part before the last "/"
      repProjectDisplay <- sub("/[^/]*$", "", projectDirectory)
      repProjectDisplay <- sub("^.*/", "", repProjectDisplay)
      # Afficher les paramètres pour le débogage
      print(paste("tableName:", tableName))
      print(paste("nomProject:", nomProject))
      print(paste("repProject:", repProjectDisplay))
      print(paste("nbrModels:", nbrModels))

      # Charger les packages nécessaires
      library(officer)
      library(magrittr)

      # Créer un document Word avec un paragraphe
      doc <- read_docx() %>%
        body_add_par("Ceci est un paragraphe dans un fichier Word", style = "Normal")

      # Chemin du fichier à enregistrer
      filePath <- file.path(projectDirectory, "rapport.docx")

      # Enregistrer le document Word
      print(doc, target = filePath)

      # Retourner un message de succès
      "La création du modèle prédictif est exécutée avec succès"
    },
    error = function(e) {
      # Gérer l'erreur
      paste("Une erreur s'est produite lors de l'exécution de la modélisation :", e$message)
    }
  )

  # Retourner le résultat
  return(output)
}

# Appeler la fonction prediction avec les arguments fournis
result <- prediction(tableName, nomProject, projectDirectory, nbrModels)
cat(result)

# nolint end
