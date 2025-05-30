/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
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
        for (int i = 0; i < 16; i++) {
            y += entrada[i] * pesos[i];
        }
        return y;
    }

   
    public String teste(int[][] mat, double[][] pesos, double limiar) {
        double[] entrada = montaEntrada(mat);
        double maiorY = Double.NEGATIVE_INFINITY;
        int digito = -1;

        for (int n = 0; n < 10; n++) {
            double y = somatorio(entrada, pesos[n]);
            if (y > maiorY) {
                maiorY = y;
                digito = n;
            }
        }

        if (maiorY > limiar) {
            return Integer.toString(digito);
        } else {
            return "?";
        }
    }
}
