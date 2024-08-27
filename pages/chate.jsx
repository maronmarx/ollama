"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import "animate.css";
import AvatarImage from "../public/logoMyentreprise.webp";
import { motion } from "framer-motion";
import MessageButtonGroup from "../components/MessageButtonGroup";
import BotMessageWithInput from "../components/BotMessageWithInput";
import "../styles/globals.css";

function ChatBot() {
  const [tableName, setTableName] = useState("");
  const [nomProject, setNomProject] = useState("");
  const [modelType, setModelType] = useState(null);
  const [tablePath, setTablePath] = useState("");
  const [nbrModels, setNbrModels] = useState(null);
  const messagesEndRef = useRef(null);
  const [botTyping, setBotTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState();
  const [showProjectMessage, setShowProjectMessage] = useState(false);
  const [projectDirectory, setProjectDirectory] = useState("");
  const [showInputArea, setShowInputArea] = useState(true);
  const nomProjectRef = useRef(nomProject);
  const projectDirectoryRef = useRef(projectDirectory);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
    nomProjectRef.current = nomProject;
  }, [nomProject]);

  useEffect(() => {
    projectDirectoryRef.current = projectDirectory;
  }, [projectDirectory]);
  // Vérifier si projectDirectory est bien mis à jour
  useEffect(() => {
    if (projectDirectory) {
      setProjectDirectory(projectDirectory);
    }
  }, [projectDirectory]);

  useEffect(() => {
    if (waitingForInput) {
      setShowInputArea(false);
    }
  }, [waitingForInput]);
  const handleModelType = useCallback(
    (type) => {
      setModelType(type);
      setMessages((prevMessages) => {
        const idsToExclude = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Tableau des ID à exclure
        const updatedMessages = prevMessages.filter(
          (msg) => !idsToExclude.includes(msg.id)
        ); // Vérifier si l'ID du message se trouve dans le tableau d'ID à exclure
        const newUserMessage = {
          user: "user",
          text:
            type === "prediction"
              ? "Créer le modèle de prédiction"
              : "Créer le modèle de tendance",
        };
        const newBotMessage = {
          user: "MLER",
          text: "Merci de saisir le nom du projet",
          requireInput: true,
        };
        return [...updatedMessages, newUserMessage, newBotMessage];
      });
      setWaitingForInput(true);
    },
    [setModelType, setWaitingForInput, setNomProject, userInput]
  );

  const handleEvaluateModel = useCallback(
    async (type) => {
      setModelType("evaluatePrediction");
      setMessages((prevMessages) => {
        const idsToExclude = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Tableau des ID à exclure
        const updatedMessages = prevMessages.filter(
          (msg) => !idsToExclude.includes(msg.id)
        ); // Vérifier si l'ID du message se trouve dans le tableau d'ID à exclure
        const newUserMessage = {
          user: "user",
          text:
            type === "evaluatePrediction"
              ? "Évaluer la performance du modèle de prédiction"
              : "Évaluer la performance du modèle de tendance",
        };
        const newBotMessage = {
          user: "MLER",
          text: "Merci de saisir le nom de la table :",
          requireInput: true,
        };
        return [...updatedMessages, newUserMessage, newBotMessage];
      });
      setWaitingForInput(true);
    },
    [setModelType, setNomProject, userInput]
  );

  const handleShareModel = useCallback(async () => {
    setModelType("shared");
    setMessages((prevMessages) => {
      const idsToExclude = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Tableau des ID à exclure
      const updatedMessages = prevMessages.filter(
        (msg) => !idsToExclude.includes(msg.id)
      ); // Vérifier si l'ID du message se trouve dans le tableau d'ID à exclure
      const newUserMessage = {
        user: "user",
        text: "Partager le projet",
      };
      const newBotMessage = {
        user: "MLER",
        text: "Merci de saisir le nom du projet",
        requireInput: true,
      };
      return [...updatedMessages, newUserMessage, newBotMessage];
    });
    setWaitingForInput(true);
  }, [setModelType, setWaitingForInput, setNomProject, userInput]);

  const handleDeployModel = useCallback(async () => {
    setModelType("Deploy");
    setMessages((prevMessages) => {
      const idsToExclude = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Tableau des ID à exclure
      const updatedMessages = prevMessages.filter(
        (msg) => !idsToExclude.includes(msg.id)
      ); // Vérifier si l'ID du message se trouve dans le tableau d'ID à exclure
      const newUserMessage = {
        user: "user",
        text: "Déployer le projet",
      };
      const newBotMessage = {
        user: "MLER",
        text: "Merci de saisir le nom du projet",
        requireInput: true,
      };
      return [...updatedMessages, newUserMessage, newBotMessage];
    });
    setWaitingForInput(true);
  }, [setModelType, setWaitingForInput, setNomProject, userInput]);

  const getInitialMessages = useCallback(
    () => [
      {
        id: 1,
        user: "MLER",
        text: (
          <div>
            <p>
              Bonjour 😊, Je suis MLER, votre Machine Learning Engineer Rbot. Je
              peux créer, évaluer, partager et déployer des modèles prédictifs
              (apprentissage machine) ou de tendance (série chronologique). Je
              peux aussi répondre à vos questions concernant les informations
              mises en place dans les rapports des modèles Machine Learning
              créés. 👍👍
            </p>
          </div>
        ),
        requireInput: false,
      },
      {
        id: 2,
        user: "MLER",
        text: (
          <MessageButtonGroup
            setShowInputArea={setShowInputArea}
            handleModelType={handleModelType}
            handleEvaluateModel={handleEvaluateModel}
            handleShareModel={handleShareModel}
            handleDeployModel={handleDeployModel}
          />
        ),
        requireInput: false,
      },
    ],
    [handleModelType, handleEvaluateModel, handleShareModel, handleDeployModel]
  );
  const [messages, setMessages] = useState(getInitialMessages);

  // const handleDeployClick = useCallback(
  //   async (nomProject, projectDirectory) => {
  //     console.log("nomproject ldakjl deploy", nomProject)
  //     console.log("projectDirectory ldakhl deploy", projectDirectory)
  //     try {
  //       const response = await fetch("/api/deploy", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ nomProject, projectDirectory }),
  //         timeout: 5000, // Temps d'attente de 5 secondes
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             user: "MLER",
  //             text: `Le projet '${nomProject}' a été déployé avec succès.`,
  //             requireInput: false,
  //           },
  //           {
  //             id: 7,
  //             user: "MLER",
  //             text: "Merci de choisir l’action que vous souhaitez de",
  //             requireInput: false,
  //           },
  //           {
  //             id: 2,
  //             user: "MLER",
  //             text: (
  //               <MessageButtonGroup
  //                 handleModelType={handleModelType}
  //                 handleEvaluateModel={handleEvaluateModel}
  //                 handleShareModel={handleShareModel}
  //                 handleDeployModel={handleDeployModel}
  //               />
  //             ),
  //             requireInput: false,
  //           },
  //         ]);
  //       } else {
  //         let errorMessage = "Une erreur est survenue.";
  //         if (response.status === 409) {
  //           errorMessage = `Le projet '${nomProject}' existe déjà dans le répertoire destination.`;
  //         } else if (response.status === 404) {
  //           errorMessage = `Le projet '${nomProject}' n'existe pas dans le répertoire source.`;
  //         } else {
  //           errorMessage = data.message || "Une erreur est survenue.";
  //         }
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             user: "MLER",
  //             text: errorMessage,
  //             requireInput: false,
  //           },
  //         ]);
  //       }
  //     } catch (error) {
  //       console.error("Erreur de requête :", error);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           user: "MLER",
  //           text: "Erreur de requête. Veuillez réessayer plus tard.",
  //           requireInput: false,
  //         },
  //       ]);
  //     }
  //   },
  //   [
  //     setMessages,
  //     handleModelType,
  //     handleEvaluateModel,
  //     handleShareModel,
  //     handleDeployModel,
  //   ]
  // );
  const handleDeploybtnPartager = useCallback(
    async (nomProject) => {
      console.log("nomproject to deploy", nomProject);
      try {
        const response = await fetch("/api/deploy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomProject }),
        });

        const data = await response.json();

        if (response.ok) {
          setShowInputArea(true);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le projet '${nomProject}' a été déployé avec succès.`,
              requireInput: false,
            },
            {
              id: 7,
              user: "MLER",
              text: "Merci de choisir l'action que vous souhaitez",
              requireInput: false,
            },
            {
              id: 2,
              user: "MLER",
              text: (
                <MessageButtonGroup
                  setShowInputArea={setShowInputArea}
                  handleModelType={handleModelType}
                  handleEvaluateModel={handleEvaluateModel}
                  handleShareModel={handleShareModel}
                  handleDeployModel={handleDeployModel}
                />
              ),
              requireInput: false,
            },
          ]);
        } else {
          let errorMessage = data.message || "Une erreur est survenue.";
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: errorMessage,
              requireInput: false,
            },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Erreur de requête :", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: "Erreur de requête. Veuillez réessayer plus tard.",
            requireInput: false,
          },
          {
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [
      setMessages,
      handleModelType,
      handleEvaluateModel,
      handleShareModel,
      handleDeployModel,
    ]
  );
  const handleDeploybtnProjet = useCallback(
    async (nomProject) => {
      console.log("nomproject to deploy", nomProject);
      try {
        const response = await fetch("/api/deployer_Projet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomProject }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le projet '${nomProject}' a été déployé avec succès.`,
              requireInput: false,
            },
            {
              id: 7,
              user: "MLER",
              text: "Merci de choisir l'action que vous souhaitez",
              requireInput: false,
            },
            {
              id: 2,
              user: "MLER",
              text: (
                <MessageButtonGroup
                  setShowInputArea={setShowInputArea}
                  handleModelType={handleModelType}
                  handleEvaluateModel={handleEvaluateModel}
                  handleShareModel={handleShareModel}
                  handleDeployModel={handleDeployModel}
                />
              ),
              requireInput: false,
            },
          ]);
          setShowInputArea(true);
        } else {
          let errorMessage = data.message || "Une erreur est survenue.";
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: errorMessage,
              requireInput: false,
            },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Erreur de requête :", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: "Erreur de requête. Veuillez réessayer plus tard.",
            requireInput: false,
          },
          {
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [
      setMessages,
      handleModelType,
      handleEvaluateModel,
      handleShareModel,
      handleDeployModel,
    ]
  );

  // const handleShareClick = useCallback(
  //   async (projectDirectory) => {
  //     console.log("projectDirectory", projectDirectory);

  //     setProjectDirectory(projectDirectory);
  //     try {
  //       const response = await fetch("/api/share", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ nomProject, projectDirectory }),
  //         timeout: 5000, // Temps d'attente de 5 secondes
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         if (response.status === 200) {
  //           setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //               user: "MLER",
  //               text: `Le projet '${nomProject}' a été partagé.`,
  //               requireInput: false,
  //             },
  //             {
  //               id: 7,
  //               user: "MLER",
  //               text: "merci de choisir l’action que vous souhaitez de",
  //               requireInput: false,
  //             },
  //             {
  //               id: 2,
  //               user: "MLER",
  //               text: (
  //                 <MessageButtonGroup
  //                   handleModelType={handleModelType}
  //                   handleEvaluateModel={handleEvaluateModel}
  //                   handleShareModel={handleShareModel}
  //                   handleDeployModel={handleDeployModel}
  //                 />
  //               ),
  //               requireInput: false,
  //             },
  //           ]);
  //           setProjectDirectory(data.fullPath);
  //         }
  //       } else {
  //         if (response.status === 409) {
  //           // Conflit - projet existe déjà
  //           setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //               user: "MLER",
  //               text: `Le projet '${nomProject}' existe déjà.`,
  //               requireInput: false,
  //             },
  //             {
  //               user: "MLER",
  //               text: "Merci de saisir le nom du projet",
  //               requireInput: true,
  //             },
  //           ]);
  //           setWaitingForInput(true);
  //           setNomProject(userInput);
  //         } else {
  //           setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //               user: "MLER",
  //               text: data.message || "Une erreur est survenue.",
  //               requireInput: false,
  //             },
  //           ]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Erreur de requête :", error);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         {
  //           user: "MLER",
  //           text: "Erreur de requête. Veuillez réessayer plus tard.",
  //           requireInput: false,
  //         },
  //       ]);
  //     }
  //   },
  //   [
  //     nomProject,
  //     setMessages,
  //     setProjectDirectory,
  //     setWaitingForInput,
  //     setNomProject,
  //     userInput,
  //     handleModelType,
  //     handleEvaluateModel,
  //     handleShareModel,
  //     handleDeployModel,
  //   ]
  // );

  const prediction = useCallback(
    async (tableName, nomProject, projectDirectory, nbrModels) => {
      try {
        const response = await fetch("/api/prediction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableName,
            nomProject,
            projectDirectory,
            nbrModels,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la génération du rapport");
        }

        const result = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "MLER", text: result.message, requireInput: false },
          {
            user: "MLER",
            text: "Merci de choisir l’action que vous souhaitez",
            requireInput: false,
          },
          getInitialMessages()[1],
        ]);
        setShowInputArea(true);
      } catch (error) {
        console.error(error);
        handleError("Error generating report");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [setMessages, getInitialMessages]
  );

  // Check if project exists in partager
  const evaluer_partager = useCallback(
    async (projectName) => {
      try {
        const checkResponse = await fetch("/api/evaluer-partager", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomProject: projectName }),
        });
        const checkData = await checkResponse.json();

        if (checkData.exists) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: 20,
              user: "MLER",
              text: `Le projet "${projectName}" existe dans le répertoire partager.`,
              requireInput: false,
            },
          ]);
          console.log("checkData", checkData.projectPath);
          nomProject;
          console.log("table partager", tableName);
          console.log("projectName partager", projectName);

          await performance_prediction(
            tableName,
            projectName,
            checkData.projectPath
          );

          // const predictionResponse = await fetch('/api/evaluer_performance', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ tableName, nomProject: projectName, repProject: '/app/partager' })
          // });

          setMessages((prevMessages) => [
            ...prevMessages,
            ...getInitialMessages(),
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: 21,
              user: "MLER",
              text: `Le projet "${projectName}" n'existe pas dans le répertoire partager.`,
              requireInput: false,
            },
            {
              id: 21,
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: 22,
            user: "MLER",
            text: "Une erreur s'est produite lors du traitement de votre demande.",
            requireInput: false,
          },
          {
            id: 21,
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [
      nomProject,
      setMessages,
      setProjectDirectory,
      setWaitingForInput,
      setNomProject,
      userInput,
    ]
  );
  const evaluer_deployer = useCallback(
    async (projectName) => {
      try {
        const checkResponse = await fetch("/api/evaluer-deployer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomProject: projectName }),
        });
        const checkData = await checkResponse.json();

        if (checkData.exists) {
          setShowInputArea(true);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: 20,
              user: "MLER",
              text: `Le projet "${projectName}" existe dans le répertoire deployer.`,
              requireInput: false,
            },
          ]);
          console.log("checkData", checkData.projectPath);
          nomProject;
          console.log("table partager", tableName);
          console.log("projectName partager", projectName);

          await performance_prediction(
            tableName,
            projectName,
            checkData.projectPath
          );

          setMessages((prevMessages) => [
            ...prevMessages,
            ...getInitialMessages(),
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: 21,
              user: "MLER",
              text: `Le projet "${projectName}" n'existe pas dans le répertoire deployer.`,
              requireInput: false,
            },
            {
              id: 21,
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: 22,
            user: "MLER",
            text: "Une erreur s'est produite lors du traitement de votre demande.",
            requireInput: false,
          },
          {
            id: 21,
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [
      nomProject,
      setMessages,
      setProjectDirectory,
      setWaitingForInput,
      setNomProject,
      userInput,
    ]
  );

  const checkProject_predection = useCallback(
    async (nomProjet) => {
      setNomProject(nomProjet);
      nomProjectRef.current;
      console.log("nomProjet checkProject_predection", nomProjet);
      try {
        const response = await fetch("/api/checkproject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomProjet }),
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.exists) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le répertoire existe dans le chemin ${data.projectPath}`,
            },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
          setProjectDirectory(data.projectPath);
          projectDirectoryRef.current;
        } else if (data.created) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le répertoire a été créé dans le chemin /app/projet/${nomProjet}`,
            },
            {
              user: "MLER",
              text: "Merci de saisir le nom de la table :",
              requireInput: true,
            },
          ]);
          setProjectDirectory(data.projectPath);
          projectDirectoryRef.current;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du projet:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "MLER", text: `Erreur: ${error.message}` },
        ]);
      }
    },
    [setNomProject, setMessages, setProjectDirectory]
  );
  //calcule numbre model de prediction
  const handleNumInputForModels = useCallback(
    (userInput) => {
      const numInput = parseInt(userInput, 10);

      if (numInput > 10) {
        setWaitingForInput(true);

        // Afficher les informations de débogage

        // Appeler la fonction prediction avec les paramètres requis
        prediction(tableName, nomProject, projectDirectory, numInput);
      } else if (numInput <= 10) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: "Merci de saisir un nombre supérieur à 10 de modèles à comparer.",
            requireInput: true,
          },
        ]);
        setWaitingForInput(true);
      }

      // Assurez-vous de ne pas appeler setWaitingForInput plusieurs fois inutilement
    },
    [projectDirectory, nomProject, tableName, setMessages, setWaitingForInput]
  );

  const handleSearchTableInPath = useCallback(
    async (userInput) => {
      console.log("nomProjet handleSearchTableInPath ", nomProject);
      try {
        const response = await fetch(
          `/api/checkFile/route?tableName=${userInput}`
        );
        setTablePath(userInput);
        const data = await response.json();
        const buttonsMessageId = new Date().getTime(); // Exemple d'ID unique basé sur l'heure

        if (data.exists) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le fichier ${userInput} existe dans le chemin spécifié.${tablePath}`,
              requireInput: false,
            },
          ]);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Souhaitez-vous préciser le nombre de modèles à comparer ?",
              requireInput: false,
            },
            {
              id: buttonsMessageId, // Ajoutez l'ID ici
              user: "MLER",
              text: (
                <div className="flex justify-around">
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    onClick={() => {
                      // Supprimer le message des boutons
                      setMessages((prevMessages) =>
                        prevMessages.filter(
                          (msg) => msg.id !== buttonsMessageId
                        )
                      );
                      // Afficher le message de confirmation et exécuter la fonction associée
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: "user", text: "Oui", requireInput: false },
                      ]);
                      handleNbrModelClick();
                    }}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Oui
                    </span>
                  </button>
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    onClick={() => {
                      // Supprimer le message des boutons
                      setMessages((prevMessages) =>
                        prevMessages.filter(
                          (msg) => msg.id !== buttonsMessageId
                        )
                      );
                      // Afficher le message de confirmation et exécuter la fonction associée
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: "user", text: "Non", requireInput: false },
                      ]);
                      predictionnomdel(
                        userInput,
                        nomProjectRef.current,
                        projectDirectoryRef.current
                      );
                    }}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Non
                    </span>
                  </button>
                </div>
              ),
              requireInput: false,
            },
          ]);

          if (modelType === "evaluatePrediction") {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                user: "MLER",
                text: "Merci de saisir le nom du projet",
                requireInput: true,
              },
            ]);
            setWaitingForInput(true);
            setModelType("evaluatePrediction");
          }
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le fichier ${userInput} n'existe pas dans le chemin spécifié.`,
              requireInput: false,
            },
          ]);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Merci de saisir le nom de la table :",
              requireInput: true,
            },
          ]);
        }
        setWaitingForInput(true);
      } catch (error) {
        console.error(
          "Erreur lors de la recherche du fichier dans le chemin spécifié :",
          error
        );
      }
    },
    [setMessages, setWaitingForInput, setTableName, userInput]
  );
  const handleSearchTableInPath_evaluate = useCallback(
    async (userInput) => {
      setTableName(userInput);
      console.log("nom de la table serche table ", userInput);
      try {
        const response = await fetch(
          `/api/checkFile/route?tableName=${userInput}`
        );
        setTablePath(userInput);
        const data = await response.json();
        if (data.exists) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le fichier ${userInput} existe dans le chemin spécifié.${tablePath}`,
              requireInput: false,
            },
          ]);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]),
            setWaitingForInput(true),
            setModelType("evaluatePrediction");
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: `Le fichier ${tableName} n'existe pas dans le chemin spécifié.`,
              requireInput: false,
            },
          ]);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Merci de saisir le nom de la table :",
              requireInput: true,
            },
          ]);
        }
        setWaitingForInput(true);
      } catch (error) {
        console.error(
          "Erreur lors de la recherche du fichier dans le chemin spécifié :",
          error
        );
      }
    },
    [setMessages, setWaitingForInput, setTableName, userInput]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const performance_prediction = useCallback(
    async (tableName, nomProject, repProject) => {
      console.log("nomProject de performance", nomProject);
      try {
        const response = await fetch("/api/evaluer_performance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tableName, nomProject, repProject }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'évaluation de la performance");
        }

        const result = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "MLER", text: result.message, requireInput: false },
        ]);
        setShowInputArea(true);
      } catch (error) {
        console.error(error);
        handleError("Error generating report");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    },
    [setMessages, tableName, nomProject, nbrModels]
  );
  const handleError = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "MLER", text: message, requireInput: false },
    ]);
  };

  const handleNbrModelClick = () => {
    console.log("nomProjet handleSearchTableInPath ", nomProject);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: "MLER",
        text: "Merci de saisir un nombre supérieur à 10 de modèles à comparer.",
        requireInput: true,
      },
    ]);
    setWaitingForInput(true);
  };

  const EvaluationButtons = ({ userInput, onButtonClick }) => {
    const [showButtons, setShowButtons] = useState(true);

    const handleButtonClick = (action) => {
      setShowButtons(false);

      // Appel de la fonction de rappel pour gérer le clic
      if (onButtonClick) {
        onButtonClick(action);
      }
    };

    if (!showButtons) {
      return null;
    }

    return (
      <div className="flex justify-around">
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
          onClick={() => handleButtonClick("project")}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Projet
          </span>
        </button>
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
          onClick={() => handleButtonClick("share")}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Partage
          </span>
        </button>
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
          onClick={() => handleButtonClick("deploy")}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Déploiement
          </span>
        </button>
      </div>
    );
  };
  const checkAndShareProject = async (nomProjet) => {
    try {
      const response = await fetch("/api/check-and-share-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomProjet }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      switch (data.case) {
        case 1:
          setShowInputArea(true);
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "MLER", text: data.message },
            ...getInitialMessages(),
          ]);
          break;
        case 2:
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "MLER", text: data.message },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
          break;
        case 3:
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "MLER", text: data.message },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
          break;
        case 4:
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: "MLER", text: data.message },
            {
              user: "MLER",
              text: "Merci de saisir le nom du projet",
              requireInput: true,
            },
          ]);
          break;
        default:
          throw new Error("Réponse inattendue du serveur");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification ou du partage du projet:",
        error
      );
      setShowInputArea(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "MLER", text: `Erreur: ${error.message}` },
        ...getInitialMessages(),
      ]);
    }
  };
  const handleSend = async (userInput) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "user", text: userInput, requireInput: false },
    ]);
    setUserInput("");

    // Simulez un délai pour la réponse du bot
    setBotTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (waitingForInput) {
      setWaitingForInput(false);
      const lastBotMessage = messages[messages.length - 1];

      if (
        lastBotMessage &&
        lastBotMessage.text === "Merci de saisir le nom du projet"
      ) {
        setNomProject(userInput);
        nomProjectRef.current;
        if (modelType === "prediction") {
          checkProject_predection(userInput);
        }
        // Appelez prediction ici si tout est prêt
        if (modelType !== "evaluatePrediction") {
          setWaitingForInput(true);
          setShowProjectMessage(true);
        }

        // Dans votre fonction handleSend, remplacez la partie des boutons par ceci :
        if (modelType === "evaluatePrediction") {
          const buttonsMessageId = new Date().getTime(); // Exemple d'ID unique basé sur l'heure
          setWaitingForInput(true);
          setNomProject(userInput);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Merci de préciser le répertoire du projet",
              requireInput: false,
            },
            {
              id: buttonsMessageId, // Ajoutez l'ID ici
              user: "MLER",
              text: (
                <EvaluationButtons
                  userInput={userInput}
                  onButtonClick={(action) => {
                    // Supprimez le message des boutons après le clic
                    setMessages((prevMessages) =>
                      prevMessages.filter((msg) => msg.id !== buttonsMessageId)
                    );
                    // Affichez le message de confirmation et exécutez la fonction associée
                    switch (action) {
                      case "project":
                        setMessages((prevMessages) => [
                          ...prevMessages,
                          { user: "user", text: "Projet", requireInput: false },
                        ]);
                        chekProjectclick(userInput);
                        break;
                      case "share":
                        setMessages((prevMessages) => [
                          ...prevMessages,
                          {
                            user: "user",
                            text: "Partage",
                            requireInput: false,
                          },
                        ]);
                        evaluer_partager(userInput);
                        break;
                      case "deploy":
                        setMessages((prevMessages) => [
                          ...prevMessages,
                          {
                            user: "user",
                            text: "Déploiement",
                            requireInput: false,
                          },
                        ]);
                        evaluer_deployer(userInput);
                        break;
                      default:
                        console.error("Unknown action");
                    }
                  }}
                />
              ),
              requireInput: false,
            },
          ]);
        }

        if (modelType === "shared") {
          setWaitingForInput(true);
          checkAndShareProject(userInput);
        }
        if (modelType === "Deploy") {
          setWaitingForInput(true);
          const buttonsMessageId = new Date().getTime(); // Exemple d'ID unique basé sur l'heure

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              user: "MLER",
              text: "Souhaitez-vous préciser choisir déployer le projet à partir de 'project' ou 'partager' ?",
              requireInput: false,
            },
            {
              id: buttonsMessageId, // Ajoutez l'ID ici
              user: "MLER",
              text: (
                <div className="flex justify-around">
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    onClick={() => {
                      setMessages((prevMessages) =>
                        prevMessages.filter(
                          (msg) => msg.id !== buttonsMessageId
                        )
                      );
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: "user", text: "Partage", requireInput: false },
                      ]);
                      handleDeploybtnPartager(userInput);
                    }}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Partager
                    </span>
                  </button>
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    onClick={() => {
                      setMessages((prevMessages) =>
                        prevMessages.filter(
                          (msg) => msg.id !== buttonsMessageId
                        )
                      );
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: "user", text: "Projet", requireInput: false },
                      ]);
                      handleDeploybtnProjet(userInput);
                    }}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Projet
                    </span>
                  </button>
                </div>
              ),
              requireInput: false,
            },
          ]);
        }
      } else if (
        lastBotMessage &&
        lastBotMessage.text === "Merci de saisir le nom de la table :"
      ) {
        setWaitingForInput(true);
        if (modelType === "prediction") {
          setTableName(userInput);
          handleSearchTableInPath(userInput);
          console.log("nom de la table 1 ", userInput);
        }
        if (modelType === "evaluatePrediction") {
          setTableName(userInput);
          handleSearchTableInPath_evaluate(userInput);
          console.log("nom de la table 1 ", userInput);
        }
      } else if (
        lastBotMessage &&
        lastBotMessage.text ===
          "Merci de saisir un nombre supérieur à 10 de modèles à comparer."
      ) {
        setNbrModels(userInput);
        handleNumInputForModels(userInput);
      }
    }

    setBotTyping(false);
  };

  const chekProjectclick = async (nomProjet) => {
    try {
      const response = await fetch("/api/check-prjEval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomProjet }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.exists) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: `Le répertoire existe dans le chemin /app/projet/${nomProjet}`,
          },
        ]);
        await performance_prediction(tableName, nomProjet, data.fullPath);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...getInitialMessages(),
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "MLER",
            text: `Le répertoire /app/projet/${nomProjet} n'existe pas.`,
          },
          {
            user: "MLER",
            text: "Merci de saisir le nom du projet",
            requireInput: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du projet:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "MLER", text: `Erreur: ${error.message}` },
      ]);
    }
  };
  // Ajouter la logique pour le bouton "Déploiement"

  const predictionnomdel = async (tableName, nomProject, projectDirectory) => {
    try {
      const response = await fetch("/api/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName, nomProject, projectDirectory }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du rapport");
      }

      const result = await response.json();
      setShowInputArea(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "MLER", text: result.message, requireInput: false },
        {
          user: "MLER",
          text: "Merci de choisir l’action que vous souhaitez",
          requireInput: false,
        },
        getInitialMessages()[1],
      ]);
      // Réactiver la barre d'entrée après une mise à jour des messages
    } catch (error) {
      console.error(error);
      handleError("Error generating report");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: "MLER",
          text: "Merci de saisir le nom du projet",
          requireInput: true,
        },
      ]);
    }
  };

  const handleNewClick = () => {
    setShowInputArea(true);

    setMessages((prevMessages) => {
      // Filtrer les messages pour exclure les ID 11 et 12
      const filteredMessages = prevMessages.filter(
        (message) => message.id !== 2 && message.id !== 11 && message.id !== 12
      );

      // Mettre requireInput à false pour les messages précédents qui l'avaient à true
      const updatedMessages = filteredMessages.map((message) => {
        if (message.requireInput) {
          return { ...message, requireInput: false };
        } else {
          return message;
        }
      });

      // Ajouter les nouveaux messages
      updatedMessages.push(
        {
          id: 11,
          user: "MLER",
          text: "merci de choisir l’action que vous souhaitez de",
          requireInput: false,
        },
        {
          id: 12,
          user: "MLER",
          text: (
            <MessageButtonGroup
              setShowInputArea={setShowInputArea}
              handleModelType={handleModelType}
              handleEvaluateModel={handleEvaluateModel}
              handleShareModel={handleShareModel}
              handleDeployModel={handleDeployModel}
            />
          ),
          requireInput: false,
        }
      );

      return updatedMessages;
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Empêche le comportement par défaut du formulaire
      handleSubmit();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "") return;

    setBotTyping(true);
    setUserInput("");

    const newMessage = {
      id: messages.length + 1,
      user: "user",
      text: userInput,
      requireInput: false,
    };

    setMessages([...messages, newMessage]);
    scrollToBottom();

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMessage = {
        id: messages.length + 2,
        user: "MLER",
        text: "",
        requireInput: false,
      };

      setMessages([...messages, newMessage, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = JSON.parse(chunk);
        botMessage.text += parsedChunk.message.content;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = botMessage;
          return updatedMessages;
        });

        scrollToBottom();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setBotTyping(false);
    }
  };
  //partier input bar

  return (
    <div className="flex h-screen">
      <div className="sidebar w-1/5 bg-gray-900 text-white p-4">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-20 py-2.5 text-center me-2 mb-2"
          onClick={handleNewClick}
        >
          New
        </button>
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex flex-col h-screen">
          <div className="chat-messages" ref={messagesEndRef}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`chat-message flex items-start ${
                  msg.user === "user"
                    ? "justify-end"
                    : "justify-start bg-[#263238] text-[#1F2937]"
                } initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}`}
              >
                {msg.user !== "user" && (
                  <Image
                    src={AvatarImage}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                )}
                <div>
                  <div
                    className={`flex items-center mb-2 ${
                      msg.user === "user" ? "w-full" : ""
                    }`}
                  >
                    <div
                      className={`text-xs font-medium ml-2 username ${
                        msg.user === "user" ? "text-white w-full" : ""
                      }`}
                    >
                      {msg.user === "user" ? "user" : "MLER"}
                    </div>
                  </div>
                  {msg.user === "MLER" && msg.requireInput ? (
                    <BotMessageWithInput
                      message={msg}
                      onSend={handleSend}
                      botTyping={botTyping}
                    />
                  ) : (
                    <>
                      <div
                        ref={messagesEndRef}
                        className="text-auto text-sm animate__animated animate__fadeIn"
                      >
                        {msg.text}
                      </div>
                      {botTyping &&
                        index === messages.length - 1 &&
                        msg.user === "MLER" && (
                          <div className="text-sm italic text-gray-500">
                            Bot est en train de taper...
                          </div>
                        )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {showInputArea && (
            <div className="flex items-center relative p-4 justify-center">
              <motion.textarea
                className="messageAi-input"
                placeholder="Nouvelle entrée..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              ></motion.textarea>
              <motion.button
                className="flex-shrink-0 w-12 h-12 p-2 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                disabled={userInput.trim() === ""}
                transition={{ duration: 0.5 }}
              >
                <Image src="/envoyer.png" alt="Send" width={24} height={24} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChatBot;
