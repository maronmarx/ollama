FROM node:20.15.0

# Installer R et les dépendances nécessaires
RUN apt-get update && \
    apt-get install -y \
    r-base \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libharfbuzz-dev \
    libfribidi-dev \
    libfontconfig1-dev \
    libmariadb-dev-compat \
    libmariadb-dev

# Installer les packages R 'officer' et 'magrittr'
RUN R -e "install.packages('remotes', repos='http://cran.rstudio.com/')" && \
    R -e "remotes::install_cran('officer')" && \
    R -e "remotes::install_cran('magrittr')"

# Vérifier que les packages sont bien installés
RUN R -e "if (!requireNamespace('officer', quietly = TRUE)) stop('Package officer is not installed')" && \
    R -e "if (!requireNamespace('magrittr', quietly = TRUE)) stop('Package magrittr is not installed')"
# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json et installer les dépendances Node.js avant de copier tout le projet
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier tout le projet dans le répertoire de travail
COPY . .

# Build the Next.js application
# RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'application Next.js en mode production
CMD ["npm", "run","dev"]
