pipeline {
    agent any
    
    environment {
        DOCKER_USER     = 'dockerpawan09'
        BACKEND_REPO    = 'employee-backend'
        FRONTEND_REPO   = 'employee-frontend'
        GITHUB_USER     = 'Pawan0090'               // 🔐 Your exact GitHub username
        MANIFEST_REPO   = '3tier-k8s-manifests'     // 📂 Your exact manifest repository
        NEW_TAG         = "v${BUILD_NUMBER}"
    }
    
    stages {
        stage('Pulling Latest Code') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Build & Push Backend') {
            steps {
                // 🔐 Uses 'Docker-Cred' matching your exact Jenkins Vault casing
                withCredentials([usernamePassword(credentialsId: 'Docker-Cred', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_ID')]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER_ID --password-stdin
                    cd backend
                    docker build -t ${DOCKER_USER}/${BACKEND_REPO}:${NEW_TAG} .
                    docker push ${DOCKER_USER}/${BACKEND_REPO}:${NEW_TAG}
                    """
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                sh """
                cd frontend
                docker build -t ${DOCKER_USER}/${FRONTEND_REPO}:${NEW_TAG} .
                docker push ${DOCKER_USER}/${FRONTEND_REPO}:${NEW_TAG}
                """
            }
        }

        stage('Update GitOps Manifests') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GH_TOKEN')]) {
                    sh """
                    # 1. Clear out any existing directory leftovers to prevent conflicts
                    rm -rf ${MANIFEST_REPO}
                    
                    # 2. Clone the dedicated manifest repository using the secure token
                    git clone https://${GH_TOKEN}@github.com/${GITHUB_USER}/${MANIFEST_REPO}.git
                    cd ${MANIFEST_REPO}
                    
                    # 3. Configure Git Identity for the automation commit
                    git config user.name "Jenkins CI-CD Bot"
                    git config user.email "jenkins-bot@ci-cd.com"
                    
                    # 4. Use 'sed' to update values.yaml (checks root first, then handles subdirectories)
                    if [ -f "values.yaml" ]; then
                        sed -i 's/tag: .*/tag: "${NEW_TAG}"/g' values.yaml
                        git add values.yaml
                    else
                        echo "values.yaml not found at root, executing deep search..."
                        find . -name "values.yaml" -exec sed -i 's/tag: .*/tag: "${NEW_TAG}"/g' {} +
                        find . -name "values.yaml" -exec git add {} +
                    fi
                    
                    # 5. Commit and push the updated configurations directly back to the manifest repo
                    git commit -m "chore: automated tag update to ${NEW_TAG} [skip ci]" || echo "No manifest changes detected"
                    git push https://${GH_TOKEN}@github.com/${GITHUB_USER}/${MANIFEST_REPO}.git HEAD:main || git push https://${GH_TOKEN}@github.com/${GITHUB_USER}/${MANIFEST_REPO}.git HEAD:master
                    """
                }
            }
        }
    }
}
