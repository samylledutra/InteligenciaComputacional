package perceptron;

/**
 *
 * @author Samylle
 */
public class Validacao {

    public Validacao() {}

    private double[] montaEntrada(int[][] mat) {
        double[] entrada = new double[16];
        entrada[0] = 1; 
        int k = 1;
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 3; j++) {
                entrada[k++] = mat[i][j];
            }
        }
        return entrada;
    }

    private double somatorio(double[] entrada, double[] pesos) {
        double y = 0;
        for (int i = 0; i < entrada.length; i++) {
            y += entrada[i] * pesos[i];
        }
        return y;
    }

    public String teste(int[][] mat, double[][] pesos, double limiar) {
        double[] entrada = montaEntrada(mat);
        double maiorY = Double.NEGATIVE_INFINITY;
        int digitoReconhecido = -1;

        for (int n = 0; n < pesos.length; n++) { 
            double y = somatorio(entrada, pesos[n]);
            if (y > maiorY) {
                maiorY = y;
                digitoReconhecido = n;
            }
        }

        if (maiorY > limiar) {
            return Integer.toString(digitoReconhecido);
        } else {
            return "?"; 
        }
    }
}